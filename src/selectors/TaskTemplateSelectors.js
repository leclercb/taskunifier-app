import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';

export const getTaskTemplates = state => state.taskTemplates;

export const getTaskTemplatesFilteredByVisibleState = createSelector(
    [getTaskTemplates],
    (taskTemplates) => {
        return filterByVisibleState(taskTemplates);
    }
);