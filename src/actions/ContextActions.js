import { 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    addObject, 
    updateObject, 
    deleteObject, 
    cleanObjects 
} from 'actions/ObjectActions';

export const loadContextsFromFile = file => {
    return loadObjectsFromFile('contexts', file);
};

export const saveContextsToFile = (file, data) => {
    return saveObjectsToFile('contexts', file, data);
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

export const cleanContexts = () => {
    return cleanObjects('contexts');
};