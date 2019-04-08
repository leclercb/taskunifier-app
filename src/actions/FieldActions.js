import { loadObjectsFromFile, saveObjectsToFile, setObjects, addObject, updateObject, deleteObject } from './ObjectActions';

export const loadFieldsFromFile = file => {
    return loadObjectsFromFile('fields', file);
};

export const saveFieldsToFile = (file, data) => {
    return saveObjectsToFile('fields', file, data);
};

export const setFields = fields => {
    return setObjects('fields', fields);
};

export const addField = field => {
    return addObject('fields', field);
};

export const updateField = field => {
    return updateObject('fields', field);
};

export const deleteField = fieldId => {
    return deleteObject('fields', fieldId);
};