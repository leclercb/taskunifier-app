import moment from 'moment';
import { createSelector } from 'reselect';
import { getDefaultNoteFields } from 'data/DataNoteFields';
import { getSelectedNoteFilter, getSelectedNoteFilterDate } from 'selectors/AppSelectors';
import { getNoteFields } from 'selectors/NoteFieldSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';

export const getNotes = state => state.notes;

export const getNotesFilteredByVisibleState = createSelector(
    [getNotes],
    (notes) => {
        return filterByVisibleState(notes);
    }
);

export const getNotesFilteredBySelectedFilter = createSelector(
    [getNotes, getSelectedNoteFilter, getSelectedNoteFilterDate, getNoteFields],
    (notes, selectedNoteFilter, selectedNoteFilterDate, noteFields) => {
        const fields = getDefaultNoteFields().concat(filterByVisibleState(noteFields));

        return notes.filter(note => {
            if (!selectedNoteFilterDate || moment(note.creationDate).isAfter(moment(selectedNoteFilterDate))) {
                return true;
            }

            return applyFilter(selectedNoteFilter, note, fields);
        });
    }
);