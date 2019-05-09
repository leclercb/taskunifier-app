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

export function addTaskFilter(taskFilter) {
    return addObject('taskFilters', taskFilter);
}

export function updateTaskFilter(taskFilter) {
    return updateObject('taskFilters', taskFilter);
}

export function deleteTaskFilter(taskFilterId) {
    return deleteObject('taskFilters', taskFilterId);
}

export function cleanTaskFilters() {
    return cleanObjects('taskFilters');
}