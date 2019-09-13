import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';

export const getNoteFilters = state => state.noteFilters;

export const getNoteFiltersFilteredByVisibleState = createSelector(
    getNoteFilters,
    (noteFilters) => {
        return filterByVisibleState(noteFilters).sort((a, b) => compareStrings(a.title, b.title));
    }
);