import {
    addObject,
    cleanObjects,
    deleteObject,
    loadObjectsFromFile,
    saveObjectsToFile,
    setObjects,
    updateObject
} from 'actions/ObjectActions';

export function loadNotesFromFile(file) {
    return dispatch => dispatch(loadObjectsFromFile('notes', file));
}

export function saveNotesToFile(file, data) {
    return saveObjectsToFile('notes', file, data);
}

export function setNotes(notes) {
    return dispatch => dispatch(setObjects('notes', notes));
}

export function addNote(note) {
    return dispatch => dispatch(addObject('notes', note));
}

export function updateNote(note) {
    return dispatch => dispatch(updateObject('notes', note));
}

export function deleteNote(noteId) {
    return dispatch => dispatch(deleteObject('notes', noteId));
}

export function cleanNotes() {
    return dispatch => dispatch(cleanObjects('notes'));
}