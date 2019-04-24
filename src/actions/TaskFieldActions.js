import { 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    addObject, 
    updateObject, 
    deleteObject, 
    cleanObjects 
} from 'actions/ObjectActions';

export const loadTaskFieldsFromFile = file => {
    return loadObjectsFromFile('taskFields', file);
};

export const saveTaskFieldsToFile = (file, data) => {
    return saveObjectsToFile('taskFields', file, data);
};

export const setTaskFields = taskFields => {
    return setObjects('taskFields', taskFields);
};

export const addTaskField = taskField => {
    return addObject('taskFields', taskField);
};

export const updateTaskField = taskField => {
    return updateObject('taskFields', taskField);
};

export const deleteTaskField = taskFieldId => {
    return deleteObject('taskFields', taskFieldId);
};

export const cleanTaskFields = () => {
    return cleanObjects('taskFields');
};