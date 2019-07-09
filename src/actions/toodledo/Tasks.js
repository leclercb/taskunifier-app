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
import { getToodledoAccountInfo } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

const CHUNK_SIZE = 50;

export function synchronizeTasks() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let tasks = getTasks(getState());

        {
            const tasksToAdd = filterByVisibleState(tasks).filter(task => !task.refIds.toodledo);

            if (tasksToAdd.length > 0) {
                const result = await dispatch(addRemoteTasks(tasksToAdd));

                for (let task of result) {
                    await dispatch(updateTask(task, { loaded: true }));
                }
            }
        }

        tasks = getTasks(getState());

        {
            const tasksToDelete = tasks.filter(task => !!task.refIds.toodledo && task.state === 'TO_DELETE');

            if (tasksToDelete.length > 0) {
                await dispatch(deleteRemoteTasks(tasksToDelete));
            }

            for (let task of tasksToDelete) {
                await dispatch(deleteTask(task));
            }
        }

        tasks = getTasks(getState());

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastEditTask = moment.unix(getToodledoAccountInfo(getState()).lastedit_task);

            if (!lastSync || moment(lastEditTask).diff(lastSync) > 0) {
                const remoteTasks = await dispatch(getRemoteTasks(lastSync));

                for (let remoteTask of remoteTasks) {
                    const localTask = tasks.find(task => task.refIds.toodledo === remoteTask.refIds.toodledo);

                    if (!localTask) {
                        await dispatch(addTask(remoteTask, { keepRefIds: true }));
                    } else {
                        if (moment(remoteTask.modified).diff(moment(localTask.updateDate)) > 0) {
                            await dispatch(updateTask(merge(localTask, remoteTask), { loaded: true }));
                        }
                    }
                }
            }
        }

        tasks = getTasks(getState());

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastDeleteTask = moment.unix(getToodledoAccountInfo(getState()).lastdelete_task);

            if (!lastSync || moment(lastDeleteTask).diff(lastSync) > 0) {
                const remoteDeletedTasks = await dispatch(getRemoteDeletedTasks(lastSync));

                for (let remoteDeletedTask of remoteDeletedTasks) {
                    const localTask = tasks.find(task => task.refIds.toodledo === remoteDeletedTask);

                    if (localTask) {
                        await dispatch(deleteTask(localTask, { force: true }));
                    }
                }
            }
        }

        tasks = getTasks(getState());

        {
            const tasksToUpdate = tasks.filter(task => !!task.refIds.toodledo && task.state === 'TO_UPDATE');

            if (tasksToUpdate.length > 0) {
                await dispatch(editRemoteTasks(tasksToUpdate));
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
            settings,
            {
                method: 'GET',
                url: 'https://api.toodledo.com/3/tasks/get.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    after: updatedAfter ? updatedAfter.unix() : 0,
                    fields: 'context,folder,goal,location,tag,startdate,duedate,duedatemod,starttime,duetime,remind,repeat,status,star,priority,length,timer,timeron,added,note,parent,children,meta'
                }
            });

        console.debug(result);
        checkResult(result);

        return result.data.slice(1).map(task => convertTaskToTaskUnifier(task, state));
    };
}

export function getRemoteDeletedTasks(deletedAfter) {
    console.debug('getRemoteDeletedTasks', deletedAfter);

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
                    after: deletedAfter ? deletedAfter.unix() : 0
                }
            });

        console.debug(result);
        checkResult(result);

        return result.data.slice(1).map(task => convertTaskToTaskUnifier(task, state));
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
                        tasks: JSON.stringify(chunkTasks.map(task => convertTaskToToodledo(task, state)))
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
                        tasks: JSON.stringify(chunkTasks.map(task => convertTaskToToodledo(task, state)))
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

            try {
                await sendRequest(
                    settings,
                    {
                        method: 'POST',
                        url: 'https://api.toodledo.com/3/tasks/delete.php',
                        params: {
                            access_token: settings.toodledo.accessToken,
                            tasks: JSON.stringify(chunkTasks.map(task => task.refIds.toodledo))
                        }
                    });

                // checkResult(result);
            } catch (error) {
                if (!error.response || !error.response.data || error.response.data.errorCode !== 605) {
                    throw error;
                }
            }
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

    let status;

    switch (task.status) {
        case 'none':
            status = 0;
            break;
        case 'nextAction':
            status = 1;
            break;
        case 'active':
            status = 2;
            break;
        case 'planning':
            status = 3;
            break;
        case 'delegated':
            status = 4;
            break;
        case 'waiting':
            status = 5;
            break;
        case 'hold':
            status = 6;
            break;
        case 'postponed':
            status = 7;
            break;
        case 'someday':
            status = 8;
            break;
        case 'cancelled':
            status = 9;
            break;
        case 'reference':
            status = 10;
            break;
        default:
            status = 0;
            break;
    }

    return {
        id: task.refIds.toodledo,
        title: task.title,
        completed: task.completed ? moment(task.completionDate).unix() : 0,
        tag: task.tags ? task.tags.join(',') : '',
        context: context ? context.refIds.toodledo : 0,
        folder: folder ? folder.refIds.toodledo : 0,
        goal: goal ? goal.refIds.toodledo : 0,
        location: location ? location.refIds.toodledo : 0,
        duedate: task.dueDate ? moment(task.dueDate).unix() : 0,
        startdate: task.startDate ? moment(task.startDate).unix() : 0,
        duetime: task.dueDate ? moment(task.dueDate).unix() : 0,
        starttime: task.startDate ? moment(task.startDate).unix() : 0,
        status,
        length: task.length,
        star: task.star ? 1 : 0
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

    let status;

    switch (task.status) {
        case 0:
            status = 'none';
            break;
        case 1:
            status = 'nextAction';
            break;
        case 2:
            status = 'active';
            break;
        case 3:
            status = 'planning';
            break;
        case 4:
            status = 'delegated';
            break;
        case 5:
            status = 'waiting';
            break;
        case 6:
            status = 'hold';
            break;
        case 7:
            status = 'postponed';
            break;
        case 8:
            status = 'someday';
            break;
        case 9:
            status = 'cancelled';
            break;
        case 10:
            status = 'reference';
            break;
        default:
            status = 'none';
            break;
    }

    return {
        refIds: {
            toodledo: task.id
        },
        title: task.title,
        completed: task.completed > 0,
        completionDate: moment(task.completed).toISOString(),
        tags: task.tag ? task.tag.split(',') : null,
        context: context ? context.id : null,
        folder: folder ? folder.id : null,
        goal: goal ? goal.id : null,
        location: location ? location.id : null,
        //duedate: task.duedate ? moment(task.duedate).toISOString() : 0,
        //startdate: task.startdate ? moment(task.startdate).toISOString() : 0,
        dueDate: task.duetime ? moment(task.duetime).toISOString() : null,
        startDate: task.starttime ? moment(task.starttime).toISOString() : null,
        status,
        length: task.length,
        star: task.star === 1 ? true : false
    };
}