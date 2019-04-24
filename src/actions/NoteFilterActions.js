import { 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    addObject, 
    updateObject, 
    deleteObject, 
    cleanObjects 
} from 'actions/ObjectActions';

export const loadNoteFiltersFromFile = file => {
    return loadObjectsFromFile('noteFilters', file);
};

export const saveNoteFiltersToFile = (file, data) => {
    return saveObjectsToFile('noteFilters', file, data);
};

export const setNoteFilters = noteFilters => {
    return setObjects('noteFilters', noteFilters);
};

export const addNoteFilter = noteFilter => {
    return addObject('noteFilters', noteFilter);
};

export const updateNoteFilter = noteFilter => {
    return updateObject('noteFilters', noteFilter);
};

export const deleteNoteFilter = noteFilterId => {
    return deleteObject('noteFilters', noteFilterId);
};

export const cleanNoteFilters = () => {
    return cleanObjects('noteFilters');
};