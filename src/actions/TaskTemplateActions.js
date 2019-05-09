import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
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

export function setTaskTemplates(taskTemplates) {
    return setObjects('taskTemplates', taskTemplates);
}

export function addTaskTemplate(taskTemplate) {
    return addObject('taskTemplates', taskTemplate);
}

export function updateTaskTemplate(taskTemplate) {
    return updateObject('taskTemplates', taskTemplate);
}

export function deleteTaskTemplate(taskTemplateId) {
    return deleteObject('taskTemplates', taskTemplateId);
}

export function cleanTaskTemplates() {
    return cleanObjects('taskTemplates');
}