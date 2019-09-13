import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNoteField, deleteNoteField, duplicateNoteField, updateNoteField } from 'actions/NoteFieldActions';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';

export function useNoteFieldApi() {
    const dispatch = useDispatch();
    const noteFields = useSelector(getNoteFieldsIncludingDefaults);

    const addNoteFieldCallback = useCallback(
        noteField => dispatch(addNoteField(noteField)),
        [dispatch]
    );

    const duplicateNoteFieldCallback = useCallback(
        noteField => dispatch(duplicateNoteField(noteField)),
        [dispatch]
    );

    const updateNoteFieldCallback = useCallback(
        noteField => dispatch(updateNoteField(noteField)),
        [dispatch]
    );

    const deleteNoteFieldCallback = useCallback(
        noteFieldId => dispatch(deleteNoteField(noteFieldId)),
        [dispatch]
    );

    return {
        noteFields,
        addNoteField: addNoteFieldCallback,
        duplicateNoteField: duplicateNoteFieldCallback,
        updateNoteField: updateNoteFieldCallback,
        deleteNoteField: deleteNoteFieldCallback
    };
}