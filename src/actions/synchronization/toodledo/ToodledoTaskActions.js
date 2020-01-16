import moment from 'moment';
import qs from 'qs';
import { addTask, deleteTask, updateTask } from 'actions/TaskActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/synchronization/toodledo/ExceptionHandler';
import {
    convertTextToLocal,
    convertTextToRemote,
    convertWeirdToodledoTimestampToLocal,
    convertWeirdToodledoTimestampToRemote,
    getObjectLocalValue,
    getObjectRemoteValue
} from 'actions/synchronization/toodledo/ToodledoUtils';
import { getSettings } from 'selectors/SettingSelectors';
import { getToodledoAccountInfo } from 'selectors/SynchronizationSelectors';
import { getTasks } from 'selectors/TaskSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

const CHUNK_SIZE = 50;

export function synchronizeTasks() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let state = getState();
        let tasks = getTasks(state);
        const createdTasksWithParent = [];

        {
            const tasksToAdd = filterByVisibleState(tasks).filter(task => !task.refIds.toodledo);

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
            const tasksToDelete = tasks.filter(task => !!task.refIds.toodledo && task.state === 'TO_DELETE');

            if (tasksToDelete.length > 0) {
                await dispatch(deleteRemoteTasks(tasksToDelete));
            }

            for (let task of tasksToDelete) {
                await dispatch(deleteTask(task.id));
            }
        }

        state = getState();
        tasks = getTasks(state);

        {
            const tasksWithRemoteParent = [];

            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastEditTask = moment.unix(getToodledoAccountInfo(getState()).lastedit_task);

            if (!lastSync || lastEditTask.diff(lastSync) > 0) {
                const remoteUnconvertedTasks = await dispatch(getRemoteTasks(lastSync));

                for (let remoteUnconvertedTask of remoteUnconvertedTasks) {
                    const remoteTask = convertTaskToLocal(remoteUnconvertedTask, state);
                    const localTask = tasks.find(task => task.refIds.toodledo === remoteTask.refIds.toodledo);

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
            }
        }

        state = getState();
        tasks = getTasks(state);

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastDeleteTask = moment.unix(getToodledoAccountInfo(getState()).lastdelete_task);

            if (!lastSync || lastDeleteTask.diff(lastSync) > 0) {
                const remoteDeletedTasks = await dispatch(getRemoteDeletedTasks(lastSync));

                for (let remoteDeletedTask of remoteDeletedTasks) {
                    const localTask = tasks.find(task => task.refIds.toodledo === remoteDeletedTask.id);

                    if (localTask) {
                        await dispatch(deleteTask(localTask.id, { force: true }));
                    }
                }
            }
        }

        state = getState();
        tasks = getTasks(state);

        {
            const tasksToUpdate = tasks.filter(task => !!task.refIds.toodledo && task.state === 'TO_UPDATE');

            for (let createdTask of createdTasksWithParent) {
                if (createdTask.parent && !!tasks.find(task => !!task.refIds.toodledo && task.id === createdTask.parent)) {
                    tasksToUpdate.push(createdTask);
                }
            }

            if (tasksToUpdate.length > 0) {
                await dispatch(editRemoteTasks(tasksToUpdate));
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

        let start = 0;
        let total = 0;

        const tasks = [];

        do {
            const result = await sendRequest(
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: 'https://api.toodledo.com/3/tasks/get.php',
                    data: qs.stringify({
                        access_token: settings.toodledo.accessToken,
                        after: updatedAfter ? updatedAfter.unix() : 0,
                        start,
                        fields: 'context,folder,goal,location,tag,startdate,duedate,duedatemod,starttime,duetime,remind,repeat,status,star,priority,length,timer,timeron,added,note,parent,children,meta'
                    })
                },
                settings);

            console.debug(result);
            checkResult(result);

            start += result.data[0].num;
            total = result.data[0].total;

            tasks.push(...result.data.slice(1));
        } while (start < total);

        return tasks;
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
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/tasks/deleted.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    after: deletedAfter ? deletedAfter.unix() : 0
                })
            },
            settings);

        console.debug(result);
        checkResult(result);

        return result.data.slice(1).map(task => ({ id: task.id }));
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
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: 'https://api.toodledo.com/3/tasks/add.php',
                    data: qs.stringify({
                        access_token: settings.toodledo.accessToken,
                        tasks: JSON.stringify(chunkTasks.map(task => convertTaskToRemote(task, state, options)))
                    })
                },
                settings);

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
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: 'https://api.toodledo.com/3/tasks/edit.php',
                    data: qs.stringify({
                        access_token: settings.toodledo.accessToken,
                        tasks: JSON.stringify(chunkTasks.map(task => convertTaskToRemote(task, state)))
                    })
                },
                settings);

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
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST',
                        url: 'https://api.toodledo.com/3/tasks/delete.php',
                        data: qs.stringify({
                            access_token: settings.toodledo.accessToken,
                            tasks: JSON.stringify(chunkTasks.map(task => task.refIds.toodledo))
                        })
                    },
                    settings);

                // checkResult(result);
            } catch (error) {
                if (!error.response || !error.response.data || error.response.data.errorCode !== 605) {
                    throw error;
                }
            }
        }
    };
}

function convertTaskToRemote(task, state, options) {
    options = merge({
        skipParent: false
    }, options || {});

    const status = getStatuses().find(status => status.key === task.status);
    const priority = getPriorities().find(priority => priority.key === task.priority);

    return {
        id: task.refIds.toodledo,
        title: task.title || 'Untitled',
        completed: task.completed ? moment(task.completionDate).unix() : 0,
        tag: task.tags ? task.tags.join(',') : '',
        context: getObjectRemoteValue(state, 'context', task.context),
        folder: getObjectRemoteValue(state, 'folder', task.folder),
        goal: getObjectRemoteValue(state, 'goal', task.goal),
        location: getObjectRemoteValue(state, 'location', task.location),
        parent: !options.skipParent ? getObjectLocalValue(state, 'task', task.parent) : 0,
        duedate: convertWeirdToodledoTimestampToRemote(task.dueDate),
        startdate: convertWeirdToodledoTimestampToRemote(task.startDate),
        duetime: convertWeirdToodledoTimestampToRemote(task.dueDate),
        starttime: convertWeirdToodledoTimestampToRemote(task.startDate),
        remind: Math.round(task.startDateReminder / 60) || Math.round(task.dueDateReminder / 60) || 0,
        repeat: convertRepeatToRemote(task.repeat),
        status: status ? status.value : 0,
        length: task.length ? Math.round(task.length / 60) : 0,
        priority: priority ? priority.value : -1,
        star: task.star ? 1 : 0,
        timer: task.timer ? task.timer.value : 0,
        timeron: task.timer && task.timer.startDate ? moment(task.timer.startDate).unix() : 0,
        note: convertTextToRemote(task.text)
    };
}

function convertTaskToLocal(task, state) {
    const status = getStatuses().find(status => status.value === task.status);
    const priority = getPriorities().find(priority => priority.value === task.priority);

    return {
        updateDate: moment.unix(task.modified).toISOString(),
        refIds: {
            toodledo: task.id
        },
        title: task.title,
        completed: task.completed > 0,
        completionDate: task.completed > 0 ? moment.unix(task.completed).toISOString() : null,
        tags: task.tag ? task.tag.split(',') : null,
        context: getObjectLocalValue(state, 'context', task.context),
        folder: getObjectLocalValue(state, 'folder', task.folder),
        goal: getObjectLocalValue(state, 'goal', task.goal),
        location: getObjectLocalValue(state, 'location', task.location),
        parent: getObjectLocalValue(state, 'task', task.parent),
        dueDate: convertWeirdToodledoTimestampToLocal(task.duetime || task.duedate),
        startDate: convertWeirdToodledoTimestampToLocal(task.starttime || task.startdate),
        startDateReminder: task.remind ? task.remind * 60 : null,
        dueDateReminder: task.remind ? task.remind * 60 : null,
        repeat: convertRepeatToLocal(task.repeat),
        status: status ? status.key : null,
        length: task.length * 60,
        priority: priority ? priority.key : null,
        star: task.star === 1 ? true : false,
        timer: {
            value: task.timer,
            startDate: task.timeron ? moment.unix(task.timeron).toISOString() : null
        },
        text: convertTextToLocal(task.note)
    };
}

function getStatuses() {
    return [
        { key: 'none', value: 0 },
        { key: 'nextAction', value: 1 },
        { key: 'active', value: 2 },
        { key: 'planning', value: 3 },
        { key: 'delegated', value: 4 },
        { key: 'waiting', value: 5 },
        { key: 'hold', value: 6 },
        { key: 'postponed', value: 7 },
        { key: 'someday', value: 8 },
        { key: 'cancelled', value: 9 },
        { key: 'reference', value: 10 }
    ];
}

function getPriorities() {
    return [
        { key: 'negative', value: -1 },
        { key: 'low', value: 0 },
        { key: 'medium', value: 1 },
        { key: 'high', value: 2 },
        { key: 'top', value: 3 }
    ];
}

function convertRepeatToRemote(value) {
    if (!value) {
        return '';
    }

    const lines = value.split('\n');
    const rrule = lines.find(line => line.startsWith('RRULE:'));

    if (rrule) {
        return rrule.substr('RRULE:'.length);
    }

    return '';
}

function convertRepeatToLocal(value) {
    if (!value) {
        return null;
    }

    return 'RRULE:' + value;
}