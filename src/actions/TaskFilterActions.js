import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export const loadTaskFiltersFromFile = file => {
    return loadObjectsFromFile('taskFilters', file);
};

export const saveTaskFiltersToFile = (file, data) => {
    return saveObjectsToFile('taskFilters', file, data);
};

export const setTaskFilters = taskFilters => {
    return setObjects('taskFilters', taskFilters);
};

export const addTaskFilter = taskFilter => {
    return addObject('taskFilters', taskFilter);
};

export const updateTaskFilter = taskFilter => {
    return updateObject('taskFilters', taskFilter);
};

export const deleteTaskFilter = taskFilterId => {
    return deleteObject('taskFilters', taskFilterId);
};

export const cleanTaskFilters = () => {
    return cleanObjects('taskFilters');
};