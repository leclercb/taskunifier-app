import moment from 'moment';
import { addTask, deleteTask, updateTask } from 'actions/TaskActions';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getContextsFilteredByVisibleState } from 'selectors/ContextSelectors';
import { getFoldersFilteredByVisibleState } from 'selectors/FolderSelectors';
import { getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';
import { getTaskFieldsFilteredByVisibleState } from 'selectors/TaskFieldSelectors';
import { getTasks } from 'selectors/TaskSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { diff, merge } from 'utils/ObjectUtils';

const CHUNK_SIZE = 50;

export function synchronizeTasks() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let tasks = getTasks(getState());
        const createdTasksWithParent = [];

        {
            const tasksToAdd = filterByVisibleState(tasks).filter(task => !task.refIds.taskunifier);

            if (tasksToAdd.length > 0) {
                const result = await dispatch(addRemoteTasks(tasksToAdd, { skipParent: true }));

                for (let task of result) {
                    await dispatch(updateTask(task, { loaded: true }));

                    if (task.parent) {
                        createdTasksWithParent.push(task);
                    }
                }
            }
        }

        tasks = getTasks(getState());

        {
            const tasksToDelete = tasks.filter(task => !!task.refIds.taskunifier && task.state === 'TO_DELETE');

            if (tasksToDelete.length > 0) {
                await dispatch(deleteRemoteTasks(tasksToDelete));
            }

            for (let task of tasksToDelete) {
                await dispatch(deleteTask(task.id));
            }
        }

        tasks = getTasks(getState());

        const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
        const remoteTasks = await dispatch(getRemoteTasks(lastSync));

        for (let remoteTask of remoteTasks) {
            const localTask = tasks.find(task => task.refIds.taskunifier === remoteTask.refIds.taskunifier);

            if (!localTask) {
                await dispatch(addTask(remoteTask, { keepRefIds: true }));
            } else {
                if (moment(remoteTask.updateDate).diff(moment(localTask.updateDate)) > 0) {
                    if (!createdTasksWithParent.find(task => task.id === localTask.id)) {
                        await dispatch(updateTask(merge(localTask, remoteTask), { loaded: true }));
                    }
                }
            }
        }

        tasks = getTasks(getState());

        {
            const remoteDeletedTasks = await dispatch(getRemoteDeletedTasks(lastSync));

            for (let remoteDeletedTask of remoteDeletedTasks) {
                const localTask = tasks.find(task => task.refIds.taskunifier === remoteDeletedTask.id);

                if (localTask) {
                    await dispatch(deleteTask(localTask.id, { force: true }));
                }
            }
        }

        tasks = getTasks(getState());

        {
            const tasksToUpdate = tasks.filter(task => !!task.refIds.taskunifier && task.state === 'TO_UPDATE');

            for (let createdTask of createdTasksWithParent) {
                if (createdTask.parent && !!tasks.find(task => !!task.refIds.taskunifier && task.id === createdTask.parent)) {
                    tasksToUpdate.push(createdTask);
                }
            }

            if (tasksToUpdate.length > 0) {
                await dispatch(editRemoteTasks(tasksToUpdate, remoteTasks));
            }

            for (let task of tasksToUpdate) {
                await dispatch(updateTask(task, { loaded: true }));
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

        return result.data.map(task => convertTaskToLocal(task, state));
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

export function editRemoteTasks(tasks, remoteTasks) {
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
                        const remoteTask = remoteTasks.find(remoteTask => remoteTask.refIds.taskunifier === task.refIds.taskunifier);
                        let convertedTask = convertTaskToRemote(task, state);

                        if (remoteTask) {
                            convertedTask = diff(convertedTask, convertTaskToRemote(remoteTask, state));
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
    options = merge({
        skipParent: false
    }, options || {});

    const contexts = getContextsFilteredByVisibleState(state);
    const folders = getFoldersFilteredByVisibleState(state);
    const goals = getGoalsFilteredByVisibleState(state);
    const locations = getLocationsFilteredByVisibleState(state);

    const context = contexts.find(context => context.id === task.context);
    const folder = folders.find(folder => folder.id === task.folder);
    const goal = goals.find(goal => goal.id === task.goal);
    const location = locations.find(location => location.id === task.location);

    const remoteTask = {
        ...task,
        context: context ? context.refIds.taskunifier : null,
        folder: folder ? folder.refIds.taskunifier : null,
        goal: goal ? goal.refIds.taskunifier : null,
        location: location ? location.refIds.taskunifier : null
    };

    delete remoteTask.id;
    delete remoteTask.refIds;
    delete remoteTask.state;
    delete remoteTask.creationDate;
    delete remoteTask.updateDate;

    if (options.skipParent) {
        delete remoteTask.parent;
    } else {
        const tasks = getTaskFieldsFilteredByVisibleState(state);
        const parent = tasks.find(t => t.id === task.parent);
        remoteTask.parent = parent ? parent.refIds.taskunifier : null;
    }

    return remoteTask;
}

function convertTaskToLocal(task, state) {
    const contexts = getContextsFilteredByVisibleState(state);
    const folders = getFoldersFilteredByVisibleState(state);
    const goals = getGoalsFilteredByVisibleState(state);
    const locations = getLocationsFilteredByVisibleState(state);
    const tasks = getTaskFieldsFilteredByVisibleState(state);

    const context = contexts.find(context => context.refIds.taskunifier === task.context);
    const folder = folders.find(folder => folder.refIds.taskunifier === task.folder);
    const goal = goals.find(goal => goal.refIds.taskunifier === task.goal);
    const location = locations.find(location => location.refIds.taskunifier === task.location);
    const parent = tasks.find(t => t.refIds.taskunifier === task.parent);

    const localTask = {
        ...task,
        refIds: {
            taskunifier: task.id
        },
        context: context ? context.id : null,
        folder: folder ? folder.id : null,
        goal: goal ? goal.id : null,
        location: location ? location.id : null,
        parent: parent ? parent.id : null
    };

    delete localTask.id;
    delete localTask.owner;

    return localTask;
}