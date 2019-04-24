import { 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    addObject, 
    updateObject, 
    deleteObject, 
    cleanObjects 
} from 'actions/ObjectActions';

export const loadTaskTemplatesFromFile = file => {
    return loadObjectsFromFile('taskTemplates', file);
};

export const saveTaskTemplatesToFile = (file, data) => {
    return saveObjectsToFile('taskTemplates', file, data);
};

export const setTaskTemplates = taskTemplates => {
    return setObjects('taskTemplates', taskTemplates);
};

export const addTaskTemplate = taskTemplate => {
    return addObject('taskTemplates', taskTemplate);
};

export const updateTaskTemplate = taskTemplate => {
    return updateObject('taskTemplates', taskTemplate);
};

export const deleteTaskTemplate = taskTemplateId => {
    return deleteObject('taskTemplates', taskTemplateId);
};

export const cleanTaskTemplates = () => {
    return cleanObjects('taskTemplates');
};