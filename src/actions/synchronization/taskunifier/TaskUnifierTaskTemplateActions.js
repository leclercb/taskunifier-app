import moment from 'moment';
import { addTaskTemplate, deleteTaskTemplate, updateTaskTemplate } from 'actions/TaskTemplateActions';
import { sendRequest } from 'actions/RequestActions';
import { convertFieldsToLocal, convertFieldsToRemote } from 'actions/synchronization/taskunifier/TaskUnifierUtils';
import { getConfig } from 'config/Config';
import { getTaskTemplates } from 'selectors/TaskTemplateSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import logger from 'utils/LogUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeTaskTemplates() {
    return async (dispatch, getState) => {
        let taskTemplates = getTaskTemplates(getState());

        {
            const taskTemplatesToAdd = filterByVisibleState(taskTemplates).filter(taskTemplate => !taskTemplate.refIds.taskunifier);
            const taskTemplatesToAddPromises = taskTemplatesToAdd.map(taskTemplate => dispatch(addRemoteTaskTemplate(taskTemplate)));
            const result = await Promise.all(taskTemplatesToAddPromises);

            await dispatch(updateTaskTemplate(result, { loaded: true, skipUpdateMiddleware: true }));
        }

        taskTemplates = getTaskTemplates(getState());

        {
            const taskTemplatesToDelete = taskTemplates.filter(taskTemplate => !!taskTemplate.refIds.taskunifier && taskTemplate.state === 'TO_DELETE');
            const taskTemplatesToDeletePromises = taskTemplatesToDelete.map(taskTemplate => dispatch(deleteRemoteTaskTemplate(taskTemplate)));
            await Promise.all(taskTemplatesToDeletePromises);

            await dispatch(deleteTaskTemplate(taskTemplatesToDelete.map(taskTemplate => taskTemplate.id)));
        }

        taskTemplates = getTaskTemplates(getState());

        const taskTemplatesToAdd = [];
        const taskTemplatesToUpdate = [];
        const taskTemplatesToDelete = [];
        const remoteTaskTemplates = await dispatch(getRemoteTaskTemplates());

        for (let remoteTaskTemplate of remoteTaskTemplates) {
            const localTaskTemplate = taskTemplates.find(taskTemplate => taskTemplate.refIds.taskunifier === remoteTaskTemplate.refIds.taskunifier);

            if (!localTaskTemplate) {
                taskTemplatesToAdd.push(remoteTaskTemplate);
            } else {
                if (moment(remoteTaskTemplate.updateDate).diff(moment(localTaskTemplate.updateDate)) > 0) {
                    taskTemplatesToUpdate.push(merge(localTaskTemplate, remoteTaskTemplate));
                }
            }
        }

        await dispatch(addTaskTemplate(taskTemplatesToAdd, { keepRefIds: true }));
        await dispatch(updateTaskTemplate(taskTemplatesToUpdate, { loaded: true, skipUpdateMiddleware: true }));

        taskTemplates = getTaskTemplates(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localTaskTemplate of filterByVisibleState(taskTemplates)) {
            if (!remoteTaskTemplates.find(taskTemplate => taskTemplate.refIds.taskunifier === localTaskTemplate.refIds.taskunifier)) {
                taskTemplatesToDelete.push(localTaskTemplate);
            }
        }

        await dispatch(deleteTaskTemplate(taskTemplatesToDelete.map(taskTemplate => taskTemplate.id), { force: true }));

        taskTemplates = getTaskTemplates(getState());

        {
            const taskTemplatesToUpdate = taskTemplates.filter(taskTemplate => !!taskTemplate.refIds.taskunifier && taskTemplate.state === 'TO_UPDATE');
            const taskTemplatesToUpdatePromises = taskTemplatesToUpdate.map(taskTemplate => dispatch(editRemoteTaskTemplate(taskTemplate)));
            await Promise.all(taskTemplatesToUpdatePromises);

            await dispatch(updateTaskTemplate(taskTemplatesToUpdate, { loaded: true, skipUpdateMiddleware: true }));
        }
    };
}

export function getRemoteTaskTemplates(updatedAfter) {
    logger.debug('Get remote task templates');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/taskTemplates`,
                query: {
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(taskTemplate => convertTaskTemplateToLocal(taskTemplate, state));
    };
}

export function addRemoteTaskTemplate(taskTemplate) {
    logger.debug('Add remote task template', taskTemplate.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/taskTemplates`,
                data: convertTaskTemplateToRemote(taskTemplate, state)
            },
            settings);

        return {
            ...taskTemplate,
            refIds: {
                ...taskTemplate.refIds,
                taskunifier: result.data.id
            }
        };
    };
}

export function editRemoteTaskTemplate(taskTemplate) {
    logger.debug('Edit remote task template', taskTemplate.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/taskTemplates/${taskTemplate.refIds.taskunifier}`,
                data: convertTaskTemplateToRemote(taskTemplate, state)
            },
            settings);
    };
}

export function deleteRemoteTaskTemplate(taskTemplate) {
    logger.debug('Delete remote task template', taskTemplate.id);

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
                    url: `${getConfig().apiUrl}/v1/taskTemplates/${taskTemplate.refIds.taskunifier}`
                },
                settings);
        } catch (error) {
            // No throw exception if delete fails
            logger.debug('Delete remote task template error', error);
        }
    };
}

function convertTaskTemplateToRemote(taskTemplate, state) {
    const remoteTaskTemplate = {
        ...taskTemplate,
        properties: {
            ...taskTemplate.properties,
            ...convertFieldsToRemote(getTaskFieldsIncludingDefaults(state), state, taskTemplate.properties)
        }
    };

    delete remoteTaskTemplate.id;
    delete remoteTaskTemplate.refIds;
    delete remoteTaskTemplate.state;
    delete remoteTaskTemplate.creationDate;
    delete remoteTaskTemplate.updateDate;

    return remoteTaskTemplate;
}

function convertTaskTemplateToLocal(taskTemplate, state) {
    const localTaskTemplate = {
        ...taskTemplate,
        refIds: {
            taskunifier: taskTemplate.id
        },
        properties: {
            ...taskTemplate.properties,
            ...convertFieldsToLocal(getTaskFieldsIncludingDefaults(state), state, taskTemplate.properties)
        }
    };

    delete localTaskTemplate.id;
    delete localTaskTemplate.owner;

    return localTaskTemplate;
}