import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setSearchNoteValue,
    setSelectedNoteFilterDefinition,
    setSelectedNoteIds
} from 'actions/AppActions';
import { addNote, deleteNote, duplicateNote, updateNote } from 'actions/NoteActions';
import { getSearchNoteValue, getSelectedNoteFilter, getSelectedNoteIds } from 'selectors/AppSelectors';
import {
    getNotesFilteredBySelectedFilter,
    getNotesFilteredByVisibleState,
    getSelectedNotes,
    getStatistics
} from 'selectors/NoteSelectors';

export function useNoteApi() {
    const dispatch = useDispatch();

    const notes = useSelector(getNotesFilteredByVisibleState);
    const filteredNotes = useSelector(getNotesFilteredBySelectedFilter);
    const statistics = useSelector(getStatistics);

    const selectedNoteIds = useSelector(getSelectedNoteIds);
    const selectedNotes = useSelector(getSelectedNotes);
    const selectedNoteFilter = useSelector(getSelectedNoteFilter);
    const searchNoteValue = useSelector(getSearchNoteValue);

    const addNoteCallback = useCallback(
        note => dispatch(addNote(note)),
        [dispatch]
    );

    const duplicateNoteCallback = useCallback(
        note => dispatch(duplicateNote(note)),
        [dispatch]
    );

    const updateNoteCallback = useCallback(
        note => dispatch(updateNote(note)),
        [dispatch]
    );

    const deleteNoteCallback = useCallback(
        noteId => dispatch(deleteNote(noteId)),
        [dispatch]
    );

    const setSelectedNoteIdsCallback = useCallback(
        noteIds => dispatch(setSelectedNoteIds(noteIds)),
        [dispatch]
    );

    const setSelectedNoteFilterDefinitionCallback = useCallback(
        noteFilter => dispatch(setSelectedNoteFilterDefinition(noteFilter)),
        [dispatch]
    );

    const setSearchNoteValueCallback = useCallback(
        value => dispatch(setSearchNoteValue(value)),
        [dispatch]
    );

    return {
        notes,
        filteredNotes,
        statistics,
        selectedNoteIds,
        selectedNotes,
        selectedNoteFilter,
        searchNoteValue,
        addNote: addNoteCallback,
        duplicateNote: duplicateNoteCallback,
        updateNote: updateNoteCallback,
        deleteNote: deleteNoteCallback,
        setSelectedNoteIds: setSelectedNoteIdsCallback,
        setSelectedNoteFilterDefinition: setSelectedNoteFilterDefinitionCallback,
        setSearchNoteValue: setSearchNoteValueCallback
    };
}