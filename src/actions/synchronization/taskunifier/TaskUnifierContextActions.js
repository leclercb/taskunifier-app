import moment from 'moment';
import { addContext, deleteContext, updateContext } from 'actions/ContextActions';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getContexts } from 'selectors/ContextSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeContexts() {
    return async (dispatch, getState) => {
        let contexts = getContexts(getState());

        {
            const contextsToAdd = filterByVisibleState(contexts).filter(context => !context.refIds.taskunifier);
            const contextsToAddPromises = contextsToAdd.map(context => dispatch(addRemoteContext(context)));
            const result = await Promise.all(contextsToAddPromises);

            for (let context of result) {
                await dispatch(updateContext(context, { loaded: true }));
            }
        }

        contexts = getContexts(getState());

        {
            const contextsToDelete = contexts.filter(context => !!context.refIds.taskunifier && context.state === 'TO_DELETE');
            const contextsToDeletePromises = contextsToDelete.map(context => dispatch(deleteRemoteContext(context)));
            await Promise.all(contextsToDeletePromises);

            for (let context of contextsToDelete) {
                await dispatch(deleteContext(context.id));
            }
        }

        contexts = getContexts(getState());

        const remoteContexts = await dispatch(getRemoteContexts());

        for (let remoteContext of remoteContexts) {
            const localContext = contexts.find(context => context.refIds.taskunifier === remoteContext.refIds.taskunifier);

            if (!localContext) {
                await dispatch(addContext(remoteContext, { keepRefIds: true }));
            } else {
                if (moment(remoteContext.updateDate).diff(moment(localContext.updateDate)) > 0) {
                    await dispatch(updateContext(merge(localContext, remoteContext), { loaded: true }));
                }
            }
        }

        contexts = getContexts(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localContext of filterByVisibleState(contexts)) {
            if (!remoteContexts.find(context => context.refIds.taskunifier === localContext.refIds.taskunifier)) {
                await dispatch(deleteContext(localContext.id, { force: true }));
            }
        }

        contexts = getContexts(getState());

        {
            const contextsToUpdate = contexts.filter(context => !!context.refIds.taskunifier && context.state === 'TO_UPDATE');
            const contextsToUpdatePromises = contextsToUpdate.map(context => dispatch(editRemoteContext(context)));
            await Promise.all(contextsToUpdatePromises);

            for (let context of contextsToUpdate) {
                await dispatch(updateContext(context, { loaded: true }));
            }
        }
    };
}

export function getRemoteContexts(updatedAfter) {
    console.debug('getRemoteContexts');

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
    console.debug('addRemoteContext', context);

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
    console.debug('editRemoteContext', context);

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
    console.debug('deleteRemoteContext', context);

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
            console.debug(error);
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