import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadNoteFiltersFromFile(file) {
    return loadObjectsFromFile('noteFilters', file);
};

export function saveNoteFiltersToFile(file, data) {
    return saveObjectsToFile('noteFilters', file, data);
};

export function setNoteFilters(noteFilters) {
    return setObjects('noteFilters', noteFilters);
};

export function addNoteFilter(noteFilter) {
    return addObject('noteFilters', noteFilter);
};

export function updateNoteFilter(noteFilter) {
    return updateObject('noteFilters', noteFilter);
};

export function deleteNoteFilter(noteFilterId) {
    return deleteObject('noteFilters', noteFilterId);
};

export function cleanNoteFilters() {
    return cleanObjects('noteFilters');
};