import {
    loadObjectsFromFile,
    saveObjectsToFile,
    setObjects,
    addObject,
    updateObject,
    deleteObject,
    cleanObjects
} from './ObjectActions';

export const loadNotesFromFile = file => {
    return loadObjectsFromFile('notes', file);
};

export const saveNotesToFile = (file, data) => {
    return saveObjectsToFile('notes', file, data);
};

export const setNotes = notes => {
    return setObjects('notes', notes);
};

export const addNote = note => {
    return addObject('notes', note);
};

export const updateNote = note => {
    return updateObject('notes', note);
};

export const deleteNote = noteId => {
    return deleteObject('notes', noteId);
};

export const cleanNotes = () => {
    return cleanObjects('notes');
};