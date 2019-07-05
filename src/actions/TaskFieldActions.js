import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadTaskFieldsFromFile(file) {
    return loadObjectsFromFile('taskFields', file);
}

export function saveTaskFieldsToFile(file, data) {
    return saveObjectsToFile('taskFields', file, data);
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

export function deleteTaskField(taskFieldId) {
    return deleteObject('taskFields', taskFieldId);
}

export function cleanTaskFields() {
    return cleanObjects('taskFields');
}