import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVisibleNoteFieldSelector } from 'selectors/NoteFieldSelectors';

export function useNoteField(noteFieldId) {
    const getVisibleNoteField = useMemo(getVisibleNoteFieldSelector, []);
    const noteField = useSelector(state => getVisibleNoteField(state, noteFieldId));
    return noteField;
}