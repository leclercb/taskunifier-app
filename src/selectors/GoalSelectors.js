import { createSelector } from 'reselect';
import { filterByNonArchived, filterByVisibleState } from 'utils/CategoryUtils';

export const getGoals = state => state.goals;

export const getGoalsFilteredByVisibleState = createSelector(
    getGoals,
    (goals) => {
        return filterByVisibleState(goals);
    }
);

export const getGoalsFilteredByNonArchived = createSelector(
    getGoals,
    (goals) => {
        return filterByVisibleState(filterByNonArchived(goals));
    }
);