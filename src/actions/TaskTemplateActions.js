import {
    addObject,
    cleanObjects,
    deleteObject,
    duplicateObject,
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile,
    setObjects,
    updateObject
} from 'actions/ObjectActions';

export function loadTaskTemplatesFromFile(file) {
    return loadObjectsFromFile('taskTemplates', file);
}

export function saveTaskTemplatesToFile(file, data) {
    return saveObjectsToFile('taskTemplates', file, data);
}

export function loadTaskTemplatesFromServer() {
    return loadObjectsFromServer('taskTemplates');
}

export function setTaskTemplates(taskTemplates) {
    return setObjects('taskTemplates', taskTemplates);
}

export function addTaskTemplate(taskTemplate, options = {}) {
    return addObject('taskTemplates', taskTemplate, options);
}

export function duplicateTaskTemplate(taskTemplate, options = {}) {
    return duplicateObject('taskTemplates', taskTemplate, options);
}

export function updateTaskTemplate(taskTemplate, options = {}) {
    return updateObject('taskTemplates', taskTemplate, options);
}

export function deleteTaskTemplate(taskTemplateId, options = {}) {
    return deleteObject('taskTemplates', taskTemplateId, options);
}

export function cleanTaskTemplates() {
    return cleanObjects('taskTemplates');
}