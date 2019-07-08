import moment from 'moment';
import { updateTask, deleteTask, addTask } from 'actions/TaskActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/toodledo/ExceptionHandler';
import { getContextsFilteredByVisibleState } from 'selectors/ContextSelectors';
import { getFoldersFilteredByVisibleState } from 'selectors/FolderSelectors';
import { getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';
import { getTasks } from 'selectors/TaskSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getToodledoData } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

const CHUNK_SIZE = 50;

export function synchronizeTasks() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let tasks = getTasks(getState());

        {
            const tasksToAdd = filterByVisibleState(tasks).filter(task => !task.refIds.toodledo);
            const result = await dispatch(addRemoteTasks(tasksToAdd))

            for (let task of result) {
                await dispatch(updateTask(task, { loaded: true }));
            }
        }

        tasks = getTasks(getState());

        {
            const tasksToDelete = tasks.filter(task => !!task.refIds.toodledo && task.state === 'TO_DELETE');
            await dispatch(deleteRemoteTasks(tasksToDelete));

            for (let task of tasksToDelete) {
                await dispatch(deleteTask(task));
            }
        }

        tasks = getTasks(getState());

        {
            const lastEditTask = moment(getToodledoData(getState()).lastedit_task);

            if (!settings.lastSynchronizationDate ||
                moment(lastEditTask).diff(moment(settings.lastSynchronizationDate)) > 0) {
                const remoteTasks = await dispatch(getRemoteTasks());

                for (let remoteTask of remoteTasks) {
                    const localTask = tasks.find(task => task.refIds.toodledo === remoteTask.refIds.toodledo);

                    if (!localTask) {
                        await dispatch(addTask(remoteTask, { keepRefIds: true }));
                    } else {
                        await dispatch(updateTask(merge(localTask, remoteTask), { loaded: true }));
                    }
                }
            }
        }

        tasks = getTasks(getState());

        {
            const tasksToUpdate = tasks.filter(task => !!task.refIds.toodledo && task.state === 'TO_UPDATE');
            await dispatch(editRemoteTasks(tasksToUpdate));

            for (let task of tasksToUpdate) {
                await dispatch(updateTask(task, { loaded: true }));
            }
        }
    };
}

export function getRemoteTasks(updatedAfter) {
    console.debug('getRemoteTasks');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            settings,
            {
                method: 'GET',
                url: 'https://api.toodledo.com/3/tasks/get.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    after: updatedAfter.unix()
                }
            });

        checkResult(result);

        return result.data.map(task => convertTaskToTaskUnifier(task, state));
    };
}

export function getRemoteDeletedTasks(deletedAfter) {
    console.debug('getRemoteDeletedTasks');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            settings,
            {
                method: 'GET',
                url: 'https://api.toodledo.com/3/tasks/deleted.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    after: deletedAfter.unix()
                }
            });

        checkResult(result);

        return result.data.map(task => convertTaskToTaskUnifier(task, state));
    };
}

export function addRemoteTasks(tasks) {
    console.debug('addRemoteTasks', tasks);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const updatedTasks = [];

        for (let i = 0; i < tasks.length; i += CHUNK_SIZE) {
            const chunkTasks = tasks.slice(i, i + CHUNK_SIZE);

            const result = await sendRequest(
                settings,
                {
                    method: 'POST',
                    url: 'https://api.toodledo.com/3/tasks/add.php',
                    params: {
                        access_token: settings.toodledo.accessToken,
                        tasks: chunkTasks.map(task => convertTaskToToodledo(task, state))
                    }
                });

            checkResult(result);

            for (let j = 0; j < chunkTasks.length; j++) {
                updatedTasks.push({
                    ...chunkTasks[j],
                    refIds: {
                        ...chunkTasks[j].refIds,
                        toodledo: result.data[j].id
                    }
                });
            }
        }

        return updatedTasks;
    };
}

export function editRemoteTasks(tasks) {
    console.debug('editRemoteTasks', tasks);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        for (let i = 0; i < tasks.length; i += CHUNK_SIZE) {
            const chunkTasks = tasks.slice(i, i + CHUNK_SIZE);

            const result = await sendRequest(
                settings,
                {
                    method: 'POST',
                    url: 'https://api.toodledo.com/3/tasks/edit.php',
                    params: {
                        access_token: settings.toodledo.accessToken,
                        tasks: chunkTasks.map(task => convertTaskToToodledo(task, state))
                    }
                });

            checkResult(result);
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

            const result = await sendRequest(
                settings,
                {
                    method: 'POST',
                    url: 'https://api.toodledo.com/3/tasks/delete.php',
                    params: {
                        access_token: settings.toodledo.accessToken,
                        tasks: chunkTasks.map(task => task.refIds.toodledo)
                    }
                });

            checkResult(result);
        }
    };
}

function convertTaskToToodledo(task, state) {
    const contexts = getContextsFilteredByVisibleState(state);
    const folders = getFoldersFilteredByVisibleState(state);
    const goals = getGoalsFilteredByVisibleState(state);
    const locations = getLocationsFilteredByVisibleState(state);

    const context = contexts.find(context => context.id === task.context);
    const folder = folders.find(folder => folder.id === task.folder);
    const goal = goals.find(goal => goal.id === task.goal);
    const location = locations.find(location => location.id === task.location);

    return {
        id: task.refIds.toodledo,
        title: task.title,
        tag: task.tags,
        context: context ? context.refIds.toodledo : 0,
        folder: folder ? folder.refIds.toodledo : 0,
        goal: goal ? goal.refIds.toodledo : 0,
        location: location ? location.refIds.toodledo : 0
    };
}

function convertTaskToTaskUnifier(task, state) {
    const contexts = getContextsFilteredByVisibleState(state);
    const folders = getFoldersFilteredByVisibleState(state);
    const goals = getGoalsFilteredByVisibleState(state);
    const locations = getLocationsFilteredByVisibleState(state);

    const context = contexts.find(context => context.refIds.toodledo === task.context);
    const folder = folders.find(folder => folder.refIds.toodledo === task.folder);
    const goal = goals.find(goal => goal.refIds.toodledo === task.goal);
    const location = locations.find(location => location.refIds.toodledo === task.location);

    return {
        refIds: {
            toodledo: task.id
        },
        title: task.title,
        tags: task.tag,
        context: context ? context.refIds.toodledo : null,
        folder: folder ? folder.refIds.toodledo : null,
        goal: goal ? goal.refIds.toodledo : null,
        location: location ? location.refIds.toodledo : null
    };
}