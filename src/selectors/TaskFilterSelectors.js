import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';

const getTaskFilters = state => state.taskFilters;

export const getTaskFiltersFilteredByVisibleState = createSelector(
    [getTaskFilters],
    (taskFilters) => {
        return filterByVisibleState(taskFilters.all);
    }
);