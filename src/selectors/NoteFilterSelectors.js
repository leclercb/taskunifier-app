import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';

const getNoteFilters = state => state.noteFilters;

export const getNoteFiltersFilteredByVisibleState = createSelector(
    [getNoteFilters],
    (noteFilters) => {
        return filterByVisibleState(noteFilters.all);
    }
);