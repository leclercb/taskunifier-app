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
    return (dispatch, getState) => dispatch(loadObjectsFromFile('notes', file, getExtraProps(getState())));
};

export const saveNotesToFile = (file, data) => {
    return saveObjectsToFile('notes', file, data);
};

export const setNotes = notes => {
    return (dispatch, getState) => dispatch(setObjects('notes', notes, getExtraProps(getState())));
};

export const addNote = note => {
    return (dispatch, getState) => dispatch(addObject('notes', note, getExtraProps(getState())));
};

export const updateNote = note => {
    return (dispatch, getState) => dispatch(updateObject('notes', note, getExtraProps(getState())));
};

export const deleteNote = noteId => {
    return (dispatch, getState) => dispatch(deleteObject('notes', noteId, getExtraProps(getState())));
};

export const cleanNotes = () => {
    return (dispatch, getState) => dispatch(cleanObjects('notes', getExtraProps(getState())));
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
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SELECTED_NOTE_FILTER',
            noteFilter: noteFilter,
            date: moment().toJSON(),
            ...getExtraProps(getState())
        });

        return Promise.resolve();
    };
};

const getExtraProps = state => {
    return {
        settings: state.settings,
        noteFields: state.noteFields
    };
}