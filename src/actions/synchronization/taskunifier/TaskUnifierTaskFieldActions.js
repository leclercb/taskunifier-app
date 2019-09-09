import moment from 'moment';
import { addTaskField, deleteTaskField, updateTaskField } from 'actions/TaskFieldActions';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getTaskFields } from 'selectors/TaskFieldSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeTaskFields() {
    return async (dispatch, getState) => {
        let taskFields = getTaskFields(getState());

        {
            const taskFieldsToAdd = filterByVisibleState(taskFields).filter(taskField => !taskField.refIds.taskunifier);
            const taskFieldsToAddPromises = taskFieldsToAdd.map(taskField => dispatch(addRemoteTaskField(taskField)));
            const result = await Promise.all(taskFieldsToAddPromises);

            for (let taskField of result) {
                await dispatch(updateTaskField(taskField, { loaded: true }));
            }
        }

        taskFields = getTaskFields(getState());

        {
            const taskFieldsToDelete = taskFields.filter(taskField => !!taskField.refIds.taskunifier && taskField.state === 'TO_DELETE');
            const taskFieldsToDeletePromises = taskFieldsToDelete.map(taskField => dispatch(deleteRemoteTaskField(taskField)));
            await Promise.all(taskFieldsToDeletePromises);

            for (let taskField of taskFieldsToDelete) {
                await dispatch(deleteTaskField(taskField.id));
            }
        }

        taskFields = getTaskFields(getState());

        const remoteTaskFields = await dispatch(getRemoteTaskFields());

        for (let remoteTaskField of remoteTaskFields) {
            const localTaskField = taskFields.find(taskField => taskField.refIds.taskunifier === remoteTaskField.refIds.taskunifier);

            if (!localTaskField) {
                await dispatch(addTaskField(remoteTaskField, { keepRefIds: true }));
            } else {
                if (moment(remoteTaskField.updateDate).diff(moment(localTaskField.updateDate)) > 0) {
                    await dispatch(updateTaskField(merge(localTaskField, remoteTaskField), { loaded: true }));
                }
            }
        }

        taskFields = getTaskFields(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localTaskField of filterByVisibleState(taskFields)) {
            if (!remoteTaskFields.find(taskField => taskField.refIds.taskunifier === localTaskField.refIds.taskunifier)) {
                await dispatch(deleteTaskField(localTaskField.id, { force: true }));
            }
        }

        taskFields = getTaskFields(getState());

        {
            const taskFieldsToUpdate = taskFields.filter(taskField => !!taskField.refIds.taskunifier && taskField.state === 'TO_UPDATE');
            const taskFieldsToUpdatePromises = taskFieldsToUpdate.map(taskField => dispatch(editRemoteTaskField(taskField)));
            await Promise.all(taskFieldsToUpdatePromises);

            for (let taskField of taskFieldsToUpdate) {
                await dispatch(updateTaskField(taskField, { loaded: true }));
            }
        }
    };
}

export function getRemoteTaskFields(updatedAfter) {
    console.debug('getRemoteTaskFields');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/taskFields`,
                query: {
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(taskField => convertTaskFieldToLocal(taskField));
    };
}

export function addRemoteTaskField(taskField) {
    console.debug('addRemoteTaskField', taskField);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/taskFields`,
                data: convertTaskFieldToRemote(taskField)
            },
            settings);

        return {
            ...taskField,
            refIds: {
                ...taskField.refIds,
                taskunifier: result.data.id
            }
        };
    };
}

export function editRemoteTaskField(taskField) {
    console.debug('editRemoteTaskField', taskField);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/taskFields/${taskField.refIds.taskunifier}`,
                data: convertTaskFieldToRemote(taskField)
            },
            settings);
    };
}

export function deleteRemoteTaskField(taskField) {
    console.debug('deleteRemoteTaskField', taskField);

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
                    url: `${getConfig().apiUrl}/v1/taskFields/${taskField.refIds.taskunifier}`
                },
                settings);
        } catch (error) {
            // No throw exception if delete fails
            console.debug(error);
        }
    };
}

function convertTaskFieldToRemote(taskField) {
    const remoteTaskField = { ...taskField };

    delete remoteTaskField.id;
    delete remoteTaskField.refIds;
    delete remoteTaskField.state;
    delete remoteTaskField.creationDate;
    delete remoteTaskField.updateDate;

    return remoteTaskField;
}

function convertTaskFieldToLocal(taskField) {
    const localTaskField = {
        ...taskField,
        refIds: {
            taskunifier: taskField.id
        }
    };

    delete localTaskField.id;
    delete localTaskField.owner;

    return localTaskField;
}