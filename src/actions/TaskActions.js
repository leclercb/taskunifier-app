import {
    addObject,
    cleanObjects,
    deleteObject,
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile,
    saveObjectsToServer,
    setObjects,
    updateObject
} from 'actions/ObjectActions';

export function loadTasksFromFile(file) {
    return loadObjectsFromFile('tasks', file);
}

export function saveTasksToFile(file, data) {
    return saveObjectsToFile('tasks', file, data);
}

export function loadTasksFromServer() {
    return loadObjectsFromServer('tasks');
}

export function saveTasksToServer(data) {
    return saveObjectsToServer('tasks', data);
}

export function setTasks(tasks) {
    return setObjects('tasks', tasks);
}

export function addTask(task, options = {}) {
    return addObject('tasks', task, options);
}

export function updateTask(task, options = {}) {
    return updateObject('tasks', task, options);
}

export function deleteTask(taskId, options = {}) {
    return deleteObject('tasks', taskId, options);
}

export function cleanTasks() {
    return cleanObjects('tasks');
}