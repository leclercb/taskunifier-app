import moment from 'moment';
import { createSelector } from 'reselect';
import { getDefaultNoteFields } from 'data/DataNoteFields';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';

const getNoteFields = state => state.noteFields;
const getSettings = state => state.settings;

export const getNotes = state => state.notes;

export const getSelectedNoteIds = state => state.app.selectedNoteIds;
export const getSelectedNoteFilter = state => state.app.selectedNoteFilter;
export const getSelectedNoteFilterDate = state => state.app.selectedNoteFilterDate;

export const getNotesFilteredByVisibleState = createSelector(
    [getNotes],
    (notes) => {
        return filterByVisibleState(notes);
    }
);

export const getNotesFilteredBySelectedFilter = createSelector(
    [getNotes, getSelectedNoteFilter, getSelectedNoteFilterDate, getNoteFields, getSettings],
    (notes, selectedNoteFilter, selectedNoteFilterDate, noteFields, settings) => {
        const fields = getDefaultNoteFields(settings).concat(filterByVisibleState(noteFields));

        return notes.filter(note => {
            if (!selectedNoteFilterDate || moment(note.creationDate).isAfter(moment(selectedNoteFilterDate))) {
                return true;
            }

            return applyFilter(selectedNoteFilter, note, fields);
        });
    }
);