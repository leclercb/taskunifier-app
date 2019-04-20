import { 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    addObject, 
    updateObject, 
    deleteObject, 
    cleanObjects 
} from './ObjectActions';

export const loadFiltersFromFile = file => {
    return loadObjectsFromFile('filters', file);
};

export const saveFiltersToFile = (file, data) => {
    return saveObjectsToFile('filters', file, data);
};

export const setFilters = filters => {
    return setObjects('filters', filters);
};

export const addFilter = filter => {
    return addObject('filters', filter);
};

export const updateFilter = filter => {
    return updateObject('filters', filter);
};

export const deleteFilter = filterId => {
    return deleteObject('filters', filterId);
};

export const cleanFilters = () => {
    return cleanObjects('filters');
};