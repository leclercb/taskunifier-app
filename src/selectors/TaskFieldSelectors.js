import { createSelector } from 'reselect';
import { getDefaultTaskFields } from 'data/DataTaskFields';
import { filterByVisibleState } from 'utils/CategoryUtils';

export const getTaskFields = state => state.taskFields;
export const getSettings = state => state.settings;

export const getTaskFieldsFilteredByVisibleState = createSelector(
    [getTaskFields],
    (taskFields) => {
        return filterByVisibleState(taskFields);
    }
);

export const getTaskFieldsIncludingDefaults = createSelector(
    [getTaskFields, getSettings],
    (taskFields, settings) => {
        return getDefaultTaskFields(settings).concat(filterByVisibleState(taskFields));
    }
);