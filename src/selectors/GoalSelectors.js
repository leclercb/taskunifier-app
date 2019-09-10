import { createSelector } from 'reselect';
import { filterByNonArchived, filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';

export const getGoals = state => state.goals;

export const getGoalsFilteredByVisibleState = createSelector(
    getGoals,
    (goals) => {
        return filterByVisibleState(goals).sort((a, b) => compareStrings(a.title, b.title));
    }
);

export const getGoalsFilteredByNonArchived = createSelector(
    getGoalsFilteredByVisibleState,
    (goals) => {
        return filterByNonArchived(goals);
    }
);