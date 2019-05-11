import { createSelector } from 'reselect';
import { getDefaultNoteFields } from 'data/DataNoteFields';
import { filterByVisibleState } from 'utils/CategoryUtils';

export const getNoteFields = state => state.noteFields;

export const getNoteFieldsFilteredByVisibleState = createSelector(
    getNoteFields,
    (noteFields) => {
        return filterByVisibleState(noteFields);
    }
);

export const getNoteFieldsIncludingDefaults = createSelector(
    getNoteFields,
    (noteFields) => {
        return getDefaultNoteFields().concat(filterByVisibleState(noteFields));
    }
);