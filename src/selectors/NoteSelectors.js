import moment from 'moment';
import { createSelector } from 'reselect';
import { combineConditions, createNoteFilterFromDefinition, createSearchNoteValueCondition } from 'data/DataNoteFilters';
import { getSearchNoteValue, getSelectedNoteFilter, getSelectedNoteFilterDate } from 'selectors/AppSelectors';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getNoteFiltersFilteredByVisibleState } from 'selectors/NoteFilterSelectors';
import { getCategoryNoteSorters, getCombinedNoteFilterDefinitions } from 'selectors/SettingSelectors';
import { isBusy } from 'selectors/ThreadSelectors';
import { store } from 'store/Store';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';
import { applyFilter } from 'utils/FilterUtils';
import { sortObjects } from 'utils/SorterUtils';

export const canUndoNoteStateUpdate = state => state.notes.past.length > 0;
export const canRedoNoteStateUpdate = state => state.notes.future.length > 0;

export const getNotes = state => state.notes.present;

export const getNotesFilteredByVisibleState = createSelector(
    getNotes,
    (notes) => {
        return filterByVisibleState(notes).sort((a, b) => compareStrings(a.title, b.title));
    }
);

/**
 * WARNING: This selector value is not updated as long as the busy flag is set to true.
 */
let getNotesFilteredBySelectedFilterResult = [];
export const getNotesFilteredBySelectedFilter = createSelector(
    getNotesFilteredByVisibleState,
    getSearchNoteValue,
    getSelectedNoteFilter,
    getSelectedNoteFilterDate,
    getNoteFieldsIncludingDefaults,
    getNoteFiltersFilteredByVisibleState,
    getCombinedNoteFilterDefinitions,
    getCategoryNoteSorters,
    isBusy,
    (notes, searchNoteValue, selectedNoteFilter, selectedNoteFilterDate, noteFields, noteFilters, combinedNoteFilterDefinitions, categoryNoteSorters, busy) => {
        if (busy) {
            return getNotesFilteredBySelectedFilterResult;
        }

        const extraConditions = [];

        if (searchNoteValue) {
            extraConditions.push(createSearchNoteValueCondition(searchNoteValue));
        }

        (combinedNoteFilterDefinitions || []).forEach(filterDefinition => {
            const filter = createNoteFilterFromDefinition(filterDefinition, noteFilters, categoryNoteSorters);

            if (filter) {
                extraConditions.push(filter.condition);
            }
        });

        selectedNoteFilter = combineConditions(selectedNoteFilter, extraConditions);

        const filteredNotes = notes.filter(note => {
            if (moment(note.creationDate).isAfter(moment(selectedNoteFilterDate))) {
                return true;
            }

            return applyFilter(selectedNoteFilter, note, noteFields);
        });

        const result = sortObjects(filteredNotes, noteFields, selectedNoteFilter, store.getState(), null, false);
        getNotesFilteredBySelectedFilterResult = result;

        return result;
    }
);

export const getStatistics = createSelector(
    getNotesFilteredByVisibleState,
    getNotesFilteredBySelectedFilter,
    (notes, filteredNotes) => {
        const computeStats = notes => {
            const stats = { nbTotal: notes.length };
            return stats;
        };

        return {
            notes: computeStats(notes),
            filteredNotes: computeStats(filteredNotes)
        };
    }
);

export const getVisibleNoteSelector = () => createSelector(
    getNotesFilteredByVisibleState,
    (state, id) => id,
    (notes, id) => {
        return notes.find(note => note.id === id);
    }
);

export const getSelectedNotes = createSelector(
    getNotesFilteredByVisibleState,
    state => state.app.selectedNoteIds,
    (notes, selectedNoteIds) => {
        return notes.filter(note => selectedNoteIds.includes(note.id));
    }
);

export const getSelectedNoteIds = createSelector(
    getSelectedNotes,
    (selectedNotes) => {
        return selectedNotes.map(note => note.id);
    }
);