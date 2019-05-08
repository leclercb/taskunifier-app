import moment from 'moment';
import {
    addObject,
    cleanObjects,
    deleteObject,
    loadObjectsFromFile,
    saveObjectsToFile,
    setObjects,
    updateObject
} from 'actions/ObjectActions';

export const loadNotesFromFile = file => {
    return dispatch => dispatch(loadObjectsFromFile('notes', file));
};

export const saveNotesToFile = (file, data) => {
    return saveObjectsToFile('notes', file, data);
};

export const setNotes = notes => {
    return dispatch => dispatch(setObjects('notes', notes));
};

export const addNote = note => {
    return dispatch => dispatch(addObject('notes', note));
};

export const updateNote = note => {
    return dispatch => dispatch(updateObject('notes', note));
};

export const deleteNote = noteId => {
    return dispatch => dispatch(deleteObject('notes', noteId));
};

export const cleanNotes = () => {
    return dispatch => dispatch(cleanObjects('notes'));
};

export const setSelectedNoteIds = noteIds => {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_NOTE_IDS',
            noteIds: noteIds
        });

        return Promise.resolve();
    };
};

export const setSelectedNoteFilter = noteFilter => {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_NOTE_FILTER',
            noteFilter: noteFilter,
            date: moment().toJSON()
        });

        return Promise.resolve();
    };
};