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

export function loadTaskFiltersFromFile(file) {
    return loadObjectsFromFile('taskFilters', file);
}

export function saveTaskFiltersToFile(file, data) {
    return saveObjectsToFile('taskFilters', file, data);
}

export function loadTaskFiltersFromServer() {
    return loadObjectsFromServer('taskFilters');
}

export function saveTaskFiltersToServer(data) {
    return saveObjectsToServer('taskFilters', data);
}

export function setTaskFilters(taskFilters) {
    return setObjects('taskFilters', taskFilters);
}

export function addTaskFilter(taskFilter, options = {}) {
    return addObject('taskFilters', taskFilter, options);
}

export function updateTaskFilter(taskFilter, options = {}) {
    return updateObject('taskFilters', taskFilter, options);
}

export function deleteTaskFilter(taskFilterId, options = {}) {
    return deleteObject('taskFilters', taskFilterId, options);
}

export function cleanTaskFilters() {
    return cleanObjects('taskFilters');
}