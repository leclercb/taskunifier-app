import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNoteFilter, deleteNoteFilter, duplicateNoteFilter, updateNoteFilter } from 'actions/NoteFilterActions';
import { getNoteFilterCounts } from 'selectors/AppSelectors';
import { getNoteFiltersFilteredByVisibleState } from 'selectors/NoteFilterSelectors';

export function useNoteFilterApi() {
    const dispatch = useDispatch();
    const noteFilters = useSelector(getNoteFiltersFilteredByVisibleState);
    const noteFilterCounts = useSelector(getNoteFilterCounts);

    const addNoteFilterCallback = useCallback(
        noteFilter => dispatch(addNoteFilter(noteFilter)),
        [dispatch]
    );

    const duplicateNoteFilterCallback = useCallback(
        noteFilter => dispatch(duplicateNoteFilter(noteFilter)),
        [dispatch]
    );

    const updateNoteFilterCallback = useCallback(
        noteFilter => dispatch(updateNoteFilter(noteFilter)),
        [dispatch]
    );

    const deleteNoteFilterCallback = useCallback(
        noteFilterId => dispatch(deleteNoteFilter(noteFilterId)),
        [dispatch]
    );

    return {
        noteFilters,
        noteFilterCounts,
        addNoteFilter: addNoteFilterCallback,
        duplicateNoteFilter: duplicateNoteFilterCallback,
        updateNoteFilter: updateNoteFilterCallback,
        deleteNoteFilter: deleteNoteFilterCallback
    };
}