import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVisibleNoteSelector } from 'selectors/NoteSelectors';

export function useNote(noteId) {
    const getVisibleNote = useMemo(getVisibleNoteSelector, []);
    const note = useSelector(state => getVisibleNote(state, noteId));
    return note;
}