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
}

export function saveNoteFiltersToFile(file, data) {
    return saveObjectsToFile('noteFilters', file, data);
}

export function setNoteFilters(noteFilters) {
    return setObjects('noteFilters', noteFilters);
}

export function addNoteFilter(noteFilter, options = {}) {
    return addObject('noteFilters', noteFilter, options);
}

export function updateNoteFilter(noteFilter, options = {}) {
    return updateObject('noteFilters', noteFilter, options);
}

export function deleteNoteFilter(noteFilterId, options = {}) {
    return deleteObject('noteFilters', noteFilterId, options);
}

export function cleanNoteFilters() {
    return cleanObjects('noteFilters');
}