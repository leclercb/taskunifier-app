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
import logger from 'utils/LogUtils';
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
                    if (task.parent) {
                        createdTasksWithParent.push(task);
                    }
                }

                await dispatch(updateTask(result, { loaded: true, skipUpdateMiddleware: true }));
            }
        }

        state = getState();
        tasks = getTasks(state);

        {
            const tasksToDelete = tasks.filter(task => !!task.refIds.taskunifier && task.state === 'TO_DELETE');

            if (tasksToDelete.length > 0) {
                await dispatch(deleteRemoteTasks(tasksToDelete));
            }

            await dispatch(deleteTask(tasksToDelete.map(task => task.id)));
        }

        state = getState();
        tasks = getTasks(state);

        const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
        const completedAfter = moment().subtract(settings.synchronizeTasksCompletedAfter, 'month');

        const tasksToAdd = [];
        const tasksToUpdate = [];
        const tasksToUpdateParent = [];
        const remoteUnconvertedTasks = await dispatch(getRemoteTasks(lastSync, completedAfter));

        for (let remoteUnconvertedTask of remoteUnconvertedTasks) {
            const remoteTask = convertTaskToLocal(remoteUnconvertedTask, state);
            const localTask = tasks.find(task => task.refIds.taskunifier === remoteTask.refIds.taskunifier);

            if (!localTask) {
                tasksToAdd.push({
                    task: remoteTask,
                    parent: remoteUnconvertedTask.parent
                });
            } else {
                if (moment(remoteTask.updateDate).diff(moment(localTask.updateDate)) > 0) {
                    if (!createdTasksWithParent.find(task => task.id === localTask.id)) {
                        tasksToUpdate.push({
                            task: merge(localTask, remoteTask),
                            parent: remoteUnconvertedTask.parent
                        });
                    }
                }
            }
        }

        const addedTasks = await dispatch(addTask(tasksToAdd.map(task => task.task), { keepRefIds: true }));
        const updatedTasks = await dispatch(updateTask(tasksToUpdate.map(task => task.task), { loaded: true, skipUpdateMiddleware: true }));

        const storedTasks = [
            ...tasksToAdd.map((task, index) => {
                task.task = addedTasks[index];
                return task;
            }),
            ...tasksToUpdate.map((task, index) => {
                task.task = updatedTasks[index];
                return task;
            })
        ];

        state = getState();

        for (let task of storedTasks) {
            if (task.parent) {
                tasksToUpdateParent.push({
                    ...task.task,
                    parent: getObjectLocalValue(state, 'task', task.parent)
                });
            }
        }

        await dispatch(updateTask(tasksToUpdateParent, { loaded: true, skipUpdateMiddleware: true }));

        state = getState();
        tasks = getTasks(state);

        {
            const tasksToDelete = [];
            const remoteDeletedTasks = await dispatch(getRemoteDeletedTasks(lastSync));

            for (let remoteDeletedTask of remoteDeletedTasks) {
                const localTask = tasks.find(task => task.refIds.taskunifier === remoteDeletedTask.id);

                if (localTask) {
                    tasksToDelete.push(localTask);
                }
            }

            await dispatch(deleteTask(tasksToDelete.map(task => task.id), { force: true }));
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

            await dispatch(updateTask(tasksToUpdate, { loaded: true, skipUpdateMiddleware: true }));
        }
    };
}

export function getRemoteTasks(updatedAfter, completedAfter) {
    logger.debug('Get remote tasks', updatedAfter);

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
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null,
                    completedAfter: completedAfter ? completedAfter.toISOString() : null
                }
            },
            settings);

        return result.data;
    };
}

export function getRemoteDeletedTasks(deletedAfter) {
    logger.debug('Get remote deleted tasks', deletedAfter);

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

        return result.data.map(task => ({ id: task.id }));
    };
}

export function addRemoteTasks(tasks, options) {
    logger.debug('Add remote tasks', tasks.length, options);

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
    logger.debug('Edit remote tasks', tasks.length);

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
    logger.debug('Delete remote tasks', tasks.length);

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
                logger.debug('Delete remote tasks error', error);
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