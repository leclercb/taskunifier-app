import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedNoteFilter, setSelectedNoteIds } from 'actions/AppActions';
import { addNote, deleteNote, duplicateNote, updateNote } from 'actions/NoteActions';
import { getSelectedNoteFilter, getSelectedNoteIds } from 'selectors/AppSelectors';
import { getNotesFilteredBySelectedFilter, getNotesFilteredByVisibleState, getSelectedNotes } from 'selectors/NoteSelectors';

export function useNoteApi() {
    const dispatch = useDispatch();

    const notes = useSelector(getNotesFilteredByVisibleState);
    const filteredNotes = useSelector(getNotesFilteredBySelectedFilter);

    const selectedNoteIds = useSelector(getSelectedNoteIds);
    const selectedNotes = useSelector(getSelectedNotes);
    const selectedNoteFilter = useSelector(getSelectedNoteFilter);

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

    const setSelectedNoteFilterCallback = useCallback(
        noteFilter => dispatch(setSelectedNoteFilter(noteFilter)),
        [dispatch]
    );

    return {
        notes,
        filteredNotes,
        selectedNoteIds,
        selectedNotes,
        selectedNoteFilter,
        addNote: addNoteCallback,
        duplicateNote: duplicateNoteCallback,
        updateNote: updateNoteCallback,
        deleteNote: deleteNoteCallback,
        setSelectedNoteIds: setSelectedNoteIdsCallback,
        setSelectedNoteFilter: setSelectedNoteFilterCallback
    };
}