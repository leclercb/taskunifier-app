import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadTaskFiltersFromFile(file) {
    return loadObjectsFromFile('taskFilters', file);
}

export function saveTaskFiltersToFile(file, data) {
    return saveObjectsToFile('taskFilters', file, data);
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

export function deleteTaskFilter(taskFilterId) {
    return deleteObject('taskFilters', taskFilterId);
}

export function cleanTaskFilters() {
    return cleanObjects('taskFilters');
}