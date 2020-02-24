import moment from 'moment';
import { addTask, deleteTask, updateTask } from 'actions/TaskActions';
import { sendRequest } from 'actions/RequestActions';
import {
    convertFieldsToLocal,
    convertFieldsToRemote,
    convertLinkedContactsToLocal,
    convertLinkedContactsToRemote,
    convertLinkedTasksToLocal,
    convertLinkedTasksToRemote,
    getObjectLocalValue
} from 'actions/synchronization/taskunifier/TaskUnifierUtils';
import { getConfig } from 'config/Config';
import { getSettings } from 'selectors/SettingSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { getTasks } from 'selectors/TaskSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { diff, merge } from 'utils/ObjectUtils';

const CHUNK_SIZE = 50;

export function synchronizeTasks() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let state = getState();
        let tasks = getTasks(state);
        const createdTasksWithParent = [];

        {
            const tasksToAdd = filterByVisibleState(tasks).filter(task => !task.refIds.taskunifier);

            if (tasksToAdd.length > 0) {
                const result = await dispatch(addRemoteTasks(tasksToAdd, { skipParent: true }));

                for (let task of result) {
                    await dispatch(updateTask(task, { loaded: true, skipUpdateMiddleware: true }));

                    if (task.parent) {
                        createdTasksWithParent.push(task);
                    }
                }
            }
        }

        state = getState();
        tasks = getTasks(state);

        {
            const tasksToDelete = tasks.filter(task => !!task.refIds.taskunifier && task.state === 'TO_DELETE');

            if (tasksToDelete.length > 0) {
                await dispatch(deleteRemoteTasks(tasksToDelete));
            }

            for (let task of tasksToDelete) {
                await dispatch(deleteTask(task.id));
            }
        }

        state = getState();
        tasks = getTasks(state);

        const tasksWithRemoteParent = [];

        const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
        const remoteUnconvertedTasks = await dispatch(getRemoteTasks(lastSync));

        for (let remoteUnconvertedTask of remoteUnconvertedTasks) {
            const remoteTask = convertTaskToLocal(remoteUnconvertedTask, state);
            const localTask = tasks.find(task => task.refIds.taskunifier === remoteTask.refIds.taskunifier);

            let updatedTask = null;

            if (!localTask) {
                updatedTask = await dispatch(addTask(remoteTask, { keepRefIds: true }));
            } else {
                if (moment(remoteTask.updateDate).diff(moment(localTask.updateDate)) > 0) {
                    if (!createdTasksWithParent.find(task => task.id === localTask.id)) {
                        updatedTask = await dispatch(updateTask(merge(localTask, remoteTask), { loaded: true, skipUpdateMiddleware: true }));
                    }
                }
            }

            if (updatedTask && remoteUnconvertedTask.parent) {
                tasksWithRemoteParent.push({ task: updatedTask, parent: remoteUnconvertedTask.parent });
            }
        }

        state = getState();

        for (let taskWithRemoteParent of tasksWithRemoteParent) {
            await dispatch(updateTask({
                ...taskWithRemoteParent.task,
                parent: getObjectLocalValue(state, 'task', taskWithRemoteParent.parent)
            }, { loaded: true, skipUpdateMiddleware: true }));
        }

        state = getState();
        tasks = getTasks(state);

        {
            const remoteDeletedTasks = await dispatch(getRemoteDeletedTasks(lastSync));

            for (let remoteDeletedTask of remoteDeletedTasks) {
                const localTask = tasks.find(task => task.refIds.taskunifier === remoteDeletedTask.id);

                if (localTask) {
                    await dispatch(deleteTask(localTask.id, { force: true }));
                }
            }
        }

        state = getState();
        tasks = getTasks(state);

        {
            const tasksToUpdate = tasks.filter(task => !!task.refIds.taskunifier && task.state === 'TO_UPDATE');

            for (let createdTask of createdTasksWithParent) {
                if (createdTask.parent && !!tasks.find(task => !!task.refIds.taskunifier && task.id === createdTask.parent)) {
                    tasksToUpdate.push(createdTask);
                }
            }

            if (tasksToUpdate.length > 0) {
                await dispatch(editRemoteTasks(tasksToUpdate, remoteUnconvertedTasks));
            }

            for (let task of tasksToUpdate) {
                await dispatch(updateTask(task, { loaded: true, skipUpdateMiddleware: true }));
            }
        }
    };
}

export function getRemoteTasks(updatedAfter) {
    console.debug('getRemoteTasks', updatedAfter);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/tasks`,
                query: {
                    includeText: true,
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        console.debug(result);

        return result.data;
    };
}

export function getRemoteDeletedTasks(deletedAfter) {
    console.debug('getRemoteDeletedTasks', deletedAfter);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/deletedTasks`,
                query: {
                    deletedAfter: deletedAfter ? deletedAfter.toISOString() : null
                }
            },
            settings);

        console.debug(result);

        return result.data.map(task => ({ id: task.id }));
    };
}

export function addRemoteTasks(tasks, options) {
    console.debug('addRemoteTasks', tasks, options);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const updatedTasks = [];

        for (let i = 0; i < tasks.length; i += CHUNK_SIZE) {
            const chunkTasks = tasks.slice(i, i + CHUNK_SIZE);

            const result = await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${settings.taskunifier.accessToken}`
                    },
                    method: 'POST',
                    url: `${getConfig().apiUrl}/v1/tasks/batch`,
                    data: chunkTasks.map(task => convertTaskToRemote(task, state, options))
                },
                settings);

            for (let j = 0; j < chunkTasks.length; j++) {
                updatedTasks.push({
                    ...chunkTasks[j],
                    refIds: {
                        ...chunkTasks[j].refIds,
                        taskunifier: result.data[j].id
                    }
                });
            }
        }

        return updatedTasks;
    };
}

export function editRemoteTasks(tasks, remoteUnconvertedTasks) {
    console.debug('editRemoteTasks', tasks);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        for (let i = 0; i < tasks.length; i += CHUNK_SIZE) {
            const chunkTasks = tasks.slice(i, i + CHUNK_SIZE);

            await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${settings.taskunifier.accessToken}`
                    },
                    method: 'PUT',
                    url: `${getConfig().apiUrl}/v1/tasks/batch`,
                    data: chunkTasks.map(task => {
                        const remoteUnconvertedTask = remoteUnconvertedTasks.find(remoteUnconvertedTask => remoteUnconvertedTask.id === task.refIds.taskunifier);
                        let convertedTask = convertTaskToRemote(task, state);

                        if (remoteUnconvertedTask) {
                            convertedTask = diff(convertedTask, remoteUnconvertedTask);
                        }

                        return {
                            ...convertedTask,
                            id: task.refIds.taskunifier
                        };
                    }).filter(task => Object.keys(task).length > 0)
                },
                settings);
        }
    };
}

export function deleteRemoteTasks(tasks) {
    console.debug('deleteRemoteTasks', tasks);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        for (let i = 0; i < tasks.length; i += CHUNK_SIZE) {
            const chunkTasks = tasks.slice(i, i + CHUNK_SIZE);

            try {
                await sendRequest(
                    {
                        headers: {
                            Authorization: `Bearer ${settings.taskunifier.accessToken}`
                        },
                        method: 'DELETE',
                        url: `${getConfig().apiUrl}/v1/tasks/batch`,
                        params: {
                            id: chunkTasks.map(task => task.refIds.taskunifier)
                        }
                    },
                    settings);
            } catch (error) {
                // No throw exception if delete fails
                console.debug(error, error.response);
            }
        }
    };
}

function convertTaskToRemote(task, state, options) {
    options = Object.assign({
        skipParent: false
    }, options);

    const remoteTask = {
        ...convertFieldsToRemote(getTaskFieldsIncludingDefaults(state), state, task),
        linkedContacts: convertLinkedContactsToRemote(task.linkedContacts, state),
        linkedTasks: convertLinkedTasksToRemote(task.linkedTasks, state)
    };

    delete remoteTask.id;
    delete remoteTask.refIds;
    delete remoteTask.state;
    delete remoteTask.creationDate;
    delete remoteTask.updateDate;

    if (options.skipParent) {
        delete remoteTask.parent;
    }

    return remoteTask;
}

function convertTaskToLocal(task, state) {
    const localTask = {
        ...convertFieldsToLocal(getTaskFieldsIncludingDefaults(state), state, task),
        refIds: {
            taskunifier: task.id
        },
        linkedContacts: convertLinkedContactsToLocal(task.linkedContacts, state),
        linkedTasks: convertLinkedTasksToLocal(task.linkedTasks, state)
    };

    delete localTask.id;
    delete localTask.owner;

    return localTask;
}