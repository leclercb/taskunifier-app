import moment from 'moment';
import { updateContext, deleteContext, addContext } from 'actions/ContextActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/toodledo/ExceptionHandler';
import { getContexts } from 'selectors/ContextSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getToodledoAccountInfo } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeContexts() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let contexts = getContexts(getState());

        {
            const contextsToAdd = filterByVisibleState(contexts).filter(context => !context.refIds.toodledo);
            const contextsToAddPromises = contextsToAdd.map(context => dispatch(addRemoteContext(context)));
            const result = await Promise.all(contextsToAddPromises);

            for (let context of result) {
                await dispatch(updateContext(context, { loaded: true }));
            }
        }

        contexts = getContexts(getState());

        {
            const contextsToDelete = contexts.filter(context => !!context.refIds.toodledo && context.state === 'TO_DELETE');
            const contextsToDeletePromises = contextsToDelete.map(context => dispatch(deleteRemoteContext(context)));
            await Promise.all(contextsToDeletePromises);

            for (let context of contextsToDelete) {
                await dispatch(deleteContext(context));
            }
        }

        contexts = getContexts(getState());

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastEditContext = moment.unix(getToodledoAccountInfo(getState()).lastedit_context);

            if (!lastSync || moment(lastEditContext).diff(lastSync) > 0) {
                const remoteContexts = await dispatch(getRemoteContexts());

                for (let remoteContext of remoteContexts) {
                    const localContext = contexts.find(context => context.refIds.toodledo === remoteContext.refIds.toodledo);

                    if (!localContext) {
                        await dispatch(addContext(remoteContext, { keepRefIds: true }));
                    } else {
                        await dispatch(updateContext(merge(localContext, remoteContext), { loaded: true }));
                    }
                }
            }
        }

        contexts = getContexts(getState());

        {
            const contextsToUpdate = contexts.filter(context => !!context.refIds.toodledo && context.state === 'TO_UPDATE');
            const contextsToUpdatePromises = contextsToUpdate.map(context => dispatch(editRemoteContext(context)));
            await Promise.all(contextsToUpdatePromises);

            for (let context of contextsToUpdate) {
                await dispatch(updateContext(context, { loaded: true }));
            }
        }
    };
}

export function getRemoteContexts() {
    console.debug('getRemoteContexts');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            settings,
            {
                method: 'GET',
                url: 'https://api.toodledo.com/3/contexts/get.php',
                params: {
                    access_token: settings.toodledo.accessToken
                }
            });

        checkResult(result);

        return result.data.map(context => convertContextToTaskUnifier(context));
    };
}

export function addRemoteContext(context) {
    console.debug('addRemoteContext', context);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/contexts/add.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    ...convertContextToToodledo(context)
                }
            });

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
    console.debug('editRemoteContext', context);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/contexts/edit.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    ...convertContextToToodledo(context)
                }
            });

        checkResult(result);
    };
}

export function deleteRemoteContext(context) {
    console.debug('deleteRemoteContext', context);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/contexts/delete.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    id: context.refIds.toodledo
                }
            });

        // checkResult(result);
    };
}

function convertContextToToodledo(context) {
    return {
        id: context.refIds.toodledo,
        name: context.title
    };
}

function convertContextToTaskUnifier(context) {
    return {
        refIds: {
            toodledo: context.id
        },
        title: context.name
    };
}