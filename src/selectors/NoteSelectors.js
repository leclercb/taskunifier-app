import moment from 'moment';
import { createSelector } from 'reselect';
import { getDefaultNoteFields } from 'data/DataNoteFields';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';

const getNotes = state => state.notes;
const getNoteFields = state => state.noteFields;
const getSettings = state => state.settings;

export const getSelectedNoteIds = state => state.notes.selectedNoteIds;
export const getSelectedNoteFilter = state => state.notes.selectedNoteFilter;

export const getNotesFilteredByVisibleState = createSelector(
    [getNotes],
    (notes) => {
        return filterByVisibleState(notes.all);
    }
);

export const getNotesFilteredBySelectedFilter = createSelector(
    [getNotes, getNoteFields, getSettings],
    (notes, noteFields, settings) => {
        const fields = getDefaultNoteFields().concat(filterByVisibleState(noteFields.all));

        return notes.all.filter(note => {
            if (!notes.selectedNoteFilterDate ||
                moment(note.creationDate).isAfter(moment(notes.selectedNoteFilterDate))) {
                return true;
            }

            return applyFilter(notes.selectedNoteFilter, note, fields);
        });
    }
);