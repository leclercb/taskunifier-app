import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';

export const getTaskTemplates = state => state.taskTemplates;

export const getTaskTemplatesFilteredByVisibleState = createSelector(
    getTaskTemplates,
    (taskTemplates) => {
        return filterByVisibleState(taskTemplates).sort((a, b) => compareStrings(a.title, b.title));
    }
);

export const getVisibleTaskTemplateSelector = () => createSelector(
    getTaskTemplatesFilteredByVisibleState,
    (state, id) => id,
    (taskTemplates, id) => {
        return taskTemplates.find(taskTemplate => taskTemplate.id === id);
    }
);