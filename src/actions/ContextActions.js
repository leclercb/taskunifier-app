import { loadObjectsFromFile, saveObjectsToFile, setObjects, addObject, updateObject, deleteObject } from './ObjectActions';

export const loadContextsFromFile = file => {
    return loadObjectsFromFile('contexts', file);
};

export const saveContextsToFile = file => {
    return saveObjectsToFile('contexts', file);
};

export const setContexts = contexts => {
    return setObjects('contexts', contexts);
};

export const addContext = context => {
    return addObject('contexts', context);
};

export const updateContext = context => {
    return updateObject('contexts', context);
};

export const deleteContext = contextId => {
    return deleteObject('contexts', contextId);
};