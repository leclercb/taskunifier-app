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

export function addTaskField(taskField) {
    return addObject('taskFields', taskField);
}

export function updateTaskField(taskField) {
    return updateObject('taskFields', taskField);
}

export function deleteTaskField(taskFieldId) {
    return deleteObject('taskFields', taskFieldId);
}

export function cleanTaskFields() {
    return cleanObjects('taskFields');
}