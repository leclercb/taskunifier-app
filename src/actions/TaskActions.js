import moment from 'moment';
import {
    addObject,
    cleanObjects,
    deleteObject,
    loadObjectsFromFile,
    saveObjectsToFile,
    setObjects,
    updateObject
} from 'actions/ObjectActions';

export function loadTasksFromFile(file) {
    return dispatch => dispatch(loadObjectsFromFile('tasks', file));
}

export function saveTasksToFile(file, data) {
    return saveObjectsToFile('tasks', file, data);
}

export function setTasks(tasks) {
    return dispatch => dispatch(setObjects('tasks', tasks));
}

export function addTask(task) {
    return dispatch => dispatch(addObject('tasks', task));
}

export function updateTask(task) {
    return dispatch => dispatch(updateObject('tasks', task));
}

export function deleteTask(taskId) {
    return dispatch => dispatch(deleteObject('tasks', taskId));
}

export function cleanTasks() {
    return dispatch => dispatch(cleanObjects('tasks'));
}

export function setShowCompletedTasks(show) {
    return dispatch => {
        dispatch({
            type: 'SET_SHOW_COMPLETED_TASKS',
            show
        });

        return Promise.resolve();
    };
}

export function setCalendarDateMode(mode) {
    return dispatch => {
        dispatch({
            type: 'SET_CALENDAR_DATE_MODE',
            mode
        });

        return Promise.resolve();
    };
}

export function setSelectedTaskIds(taskIds) {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_IDS',
            taskIds
        });

        return Promise.resolve();
    };
}

export function setSelectedTaskFilter(taskFilter) {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_FILTER',
            taskFilter,
            date: moment().toJSON()
        });

        return Promise.resolve();
    };
}