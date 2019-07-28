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

export function loadTaskFieldsFromFile(file) {
    return loadObjectsFromFile('taskFields', file);
}

export function saveTaskFieldsToFile(file, data) {
    return saveObjectsToFile('taskFields', file, data);
}

export function loadTaskFieldsFromServer() {
    return loadObjectsFromServer('taskFields');
}

export function saveTaskFieldsToServer(data) {
    return saveObjectsToServer('taskFields', data);
}

export function setTaskFields(taskFields) {
    return setObjects('taskFields', taskFields);
}

export function addTaskField(taskField, options = {}) {
    return addObject('taskFields', taskField, options);
}

export function updateTaskField(taskField, options = {}) {
    return updateObject('taskFields', taskField, options);
}

export function deleteTaskField(taskFieldId, options = {}) {
    return deleteObject('taskFields', taskFieldId, options);
}

export function cleanTaskFields() {
    return cleanObjects('taskFields');
}