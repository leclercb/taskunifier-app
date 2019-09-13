import { createSelector } from 'reselect';
import { getDefaultNoteFields } from 'data/DataNoteFields';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';

export const getNoteFields = state => state.noteFields;

export const getNoteFieldsFilteredByVisibleState = createSelector(
    getNoteFields,
    (noteFields) => {
        return filterByVisibleState(noteFields).sort((a, b) => compareStrings(a.title, b.title));
    }
);

export const getNoteFieldsIncludingDefaults = createSelector(
    getNoteFields,
    (noteFields) => {
        return getDefaultNoteFields().concat(filterByVisibleState(noteFields)).sort((a, b) => compareStrings(a.title, b.title));
    }
);

export const getVisibleNoteFieldSelector = () => createSelector(
    getNoteFieldsFilteredByVisibleState,
    (state, id) => id,
    (noteFields, id) => {
        return noteFields.find(noteField => noteField.id === id);
    }
);