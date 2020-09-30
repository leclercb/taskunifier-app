import moment from 'moment';
import { addContext, deleteContext, updateContext } from 'actions/ContextActions';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getContexts } from 'selectors/ContextSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import logger from 'utils/LogUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeContexts() {
    return async (dispatch, getState) => {
        let contexts = getContexts(getState());

        {
            const contextsToAdd = filterByVisibleState(contexts).filter(context => !context.refIds.taskunifier);
            const contextsToAddPromises = contextsToAdd.map(context => dispatch(addRemoteContext(context)));
            const result = await Promise.all(contextsToAddPromises);

            await dispatch(updateContext(result, { loaded: true, skipUpdateMiddleware: true }));
        }

        contexts = getContexts(getState());

        {
            const contextsToDelete = contexts.filter(context => !!context.refIds.taskunifier && context.state === 'TO_DELETE');
            const contextsToDeletePromises = contextsToDelete.map(context => dispatch(deleteRemoteContext(context)));
            await Promise.all(contextsToDeletePromises);

            await dispatch(deleteContext(contextsToDelete.map(context => context.id)));
        }

        contexts = getContexts(getState());

        const contextsToAdd = [];
        const contextsToUpdate = [];
        const contextsToDelete = [];
        const remoteContexts = await dispatch(getRemoteContexts());

        for (let remoteContext of remoteContexts) {
            const localContext = contexts.find(context => context.refIds.taskunifier === remoteContext.refIds.taskunifier);

            if (!localContext) {
                contextsToAdd.push(remoteContext);
            } else {
                if (moment(remoteContext.updateDate).diff(moment(localContext.updateDate)) > 0) {
                    contextsToUpdate.push(merge(localContext, remoteContext));
                }
            }
        }

        await dispatch(addContext(contextsToAdd, { keepRefIds: true }));
        await dispatch(updateContext(contextsToUpdate, { loaded: true, skipUpdateMiddleware: true }));

        contexts = getContexts(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localContext of filterByVisibleState(contexts)) {
            if (!remoteContexts.find(context => context.refIds.taskunifier === localContext.refIds.taskunifier)) {
                contextsToDelete.push(localContext);
            }
        }

        await dispatch(deleteContext(contextsToDelete.map(context => context.id), { force: true }));

        contexts = getContexts(getState());

        {
            const contextsToUpdate = contexts.filter(context => !!context.refIds.taskunifier && context.state === 'TO_UPDATE');
            const contextsToUpdatePromises = contextsToUpdate.map(context => dispatch(editRemoteContext(context)));
            await Promise.all(contextsToUpdatePromises);

            await dispatch(updateContext(contextsToUpdate, { loaded: true, skipUpdateMiddleware: true }));
        }
    };
}

export function getRemoteContexts(updatedAfter) {
    logger.debug('Get remote contexts');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/contexts`,
                query: {
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(context => convertContextToLocal(context));
    };
}

export function addRemoteContext(context) {
    logger.debug('Add remote context', context.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/contexts`,
                data: convertContextToRemote(context)
            },
            settings);

        return {
            ...context,
            refIds: {
                ...context.refIds,
                taskunifier: result.data.id
            }
        };
    };
}

export function editRemoteContext(context) {
    logger.debug('Edit remote context', context.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/contexts/${context.refIds.taskunifier}`,
                data: convertContextToRemote(context)
            },
            settings);
    };
}

export function deleteRemoteContext(context) {
    logger.debug('Delete remote context', context.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        try {
            await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${settings.taskunifier.accessToken}`
                    },
                    method: 'DELETE',
                    url: `${getConfig().apiUrl}/v1/contexts/${context.refIds.taskunifier}`
                },
                settings);
        } catch (error) {
            // No throw exception if delete fails
            logger.debug('Delete remote context error', error);
        }
    };
}

function convertContextToRemote(context) {
    const remoteContext = { ...context };

    delete remoteContext.id;
    delete remoteContext.refIds;
    delete remoteContext.state;
    delete remoteContext.creationDate;
    delete remoteContext.updateDate;

    return remoteContext;
}

function convertContextToLocal(context) {
    const localContext = {
        ...context,
        refIds: {
            taskunifier: context.id
        }
    };

    delete localContext.id;
    delete localContext.owner;

    return localContext;
}