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