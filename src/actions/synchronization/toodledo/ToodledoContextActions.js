import moment from 'moment';
import qs from 'qs';
import { addContext, deleteContext, updateContext } from 'actions/ContextActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/synchronization/toodledo/ExceptionHandler';
import { getContexts } from 'selectors/ContextSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getToodledoAccountInfo } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import logger from 'utils/LogUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeContexts() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let contexts = getContexts(getState());

        {
            const contextsToAdd = filterByVisibleState(contexts).filter(context => !context.refIds.toodledo);
            const contextsToAddPromises = contextsToAdd.map(context => dispatch(addRemoteContext(context)));
            const result = await Promise.all(contextsToAddPromises);

            await dispatch(updateContext(result, { loaded: true, skipUpdateMiddleware: true }));
        }

        contexts = getContexts(getState());

        {
            const contextsToDelete = contexts.filter(context => !!context.refIds.toodledo && context.state === 'TO_DELETE');
            const contextsToDeletePromises = contextsToDelete.map(context => dispatch(deleteRemoteContext(context)));
            await Promise.all(contextsToDeletePromises);

            await dispatch(deleteContext(contextsToDelete.map(context => context.id)));
        }

        contexts = getContexts(getState());

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastEditContext = moment.unix(getToodledoAccountInfo(getState()).lastedit_context);

            if (!lastSync || lastEditContext.diff(lastSync) > 0) {
                const contextsToAdd = [];
                const contextsToUpdate = [];
                const contextsToDelete = [];
                const remoteContexts = await dispatch(getRemoteContexts());

                for (let remoteContext of remoteContexts) {
                    const localContext = contexts.find(context => context.refIds.toodledo === remoteContext.refIds.toodledo);

                    if (!localContext) {
                        contextsToAdd.push(remoteContext);
                    } else {
                        contextsToUpdate.push(merge(localContext, remoteContext));
                    }
                }

                await dispatch(addContext(contextsToAdd, { keepRefIds: true }));
                await dispatch(updateContext(contextsToUpdate, { loaded: true, skipUpdateMiddleware: true }));

                contexts = getContexts(getState());

                // eslint-disable-next-line require-atomic-updates
                for (let localContext of filterByVisibleState(contexts)) {
                    if (!remoteContexts.find(context => context.refIds.toodledo === localContext.refIds.toodledo)) {
                        contextsToDelete.push(localContext);
                    }
                }

                await dispatch(deleteContext(contextsToDelete.map(context => context.id), { force: true }));
            }
        }

        contexts = getContexts(getState());

        {
            const contextsToUpdate = contexts.filter(context => !!context.refIds.toodledo && context.state === 'TO_UPDATE');
            const contextsToUpdatePromises = contextsToUpdate.map(context => dispatch(editRemoteContext(context)));
            await Promise.all(contextsToUpdatePromises);

            await dispatch(updateContext(contextsToUpdate, { loaded: true, skipUpdateMiddleware: true }));
        }
    };
}

export function getRemoteContexts() {
    logger.debug('Get remote contexts');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/contexts/get.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken
                })
            },
            settings);

        checkResult(result);

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
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/contexts/add.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    ...convertContextToRemote(context)
                })
            },
            settings);

        checkResult(result);

        return {
            ...context,
            refIds: {
                ...context.refIds,
                toodledo: result.data[0].id
            }
        };
    };
}

export function editRemoteContext(context) {
    logger.debug('Edit remote context', context.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/contexts/edit.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    ...convertContextToRemote(context)
                })
            },
            settings);

        checkResult(result);
    };
}

export function deleteRemoteContext(context) {
    logger.debug('Delete remote context', context.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/contexts/delete.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    id: context.refIds.toodledo
                })
            },
            settings);

        // checkResult(result);
    };
}

function convertContextToRemote(context) {
    return {
        id: context.refIds.toodledo,
        name: context.title
    };
}

function convertContextToLocal(context) {
    return {
        refIds: {
            toodledo: context.id
        },
        title: context.name
    };
}