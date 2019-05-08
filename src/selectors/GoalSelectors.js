import { createSelector } from 'reselect';
import { filterByVisibleState, filterByNonArchived } from 'utils/CategoryUtils';

const getGoals = state => state.goals;

export const getGoalsFilteredByVisibleState = createSelector(
    [getGoals],
    (goals) => {
        return filterByVisibleState(goals.all);
    }
);

export const getGoalsFilteredByNonArchived = createSelector(
    [getGoals],
    (goals) => {
        return filterByVisibleState(filterByNonArchived(goals.all));
    }
);