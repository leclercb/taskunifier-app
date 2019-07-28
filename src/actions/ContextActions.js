import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile, 
    saveObjectsToServer, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadContextsFromFile(file) {
    return loadObjectsFromFile('contexts', file);
}

export function saveContextsToFile(file, data) {
    return saveObjectsToFile('contexts', file, data);
}

export function loadContextsFromServer() {
    return loadObjectsFromServer('contexts');
}

export function saveContextsToServer(data) {
    return saveObjectsToServer('contexts', data);
}

export function setContexts(contexts) {
    return setObjects('contexts', contexts);
}

export function addContext(context, options = {}) {
    return addObject('contexts', context, options);
}

export function updateContext(context, options = {}) {
    return updateObject('contexts', context, options);
}

export function deleteContext(contextId, options = {}) {
    return deleteObject('contexts', contextId, options);
}

export function cleanContexts() {
    return cleanObjects('contexts');
}