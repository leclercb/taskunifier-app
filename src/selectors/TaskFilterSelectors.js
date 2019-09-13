import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';

export const getTaskFilters = state => state.taskFilters;

export const getTaskFiltersFilteredByVisibleState = createSelector(
    getTaskFilters,
    (taskFilters) => {
        return filterByVisibleState(taskFilters).sort((a, b) => compareStrings(a.title, b.title));
    }
);