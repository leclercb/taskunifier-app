import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';

export const getTaskFilters = state => state.taskFilters;

export const getTaskFiltersFilteredByVisibleState = createSelector(
    [getTaskFilters],
    (taskFilters) => {
        return filterByVisibleState(taskFilters);
    }
);