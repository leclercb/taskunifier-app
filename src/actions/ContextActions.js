import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadContextsFromFile(file) {
    return loadObjectsFromFile('contexts', file);
};

export function saveContextsToFile(file, data) {
    return saveObjectsToFile('contexts', file, data);
};

export function setContexts(contexts) {
    return setObjects('contexts', contexts);
};

export function addContext(context) {
    return addObject('contexts', context);
};

export function updateContext(context) {
    return updateObject('contexts', context);
};

export function deleteContext(contextId) {
    return deleteObject('contexts', contextId);
};

export function cleanContexts() {
    return cleanObjects('contexts');
};