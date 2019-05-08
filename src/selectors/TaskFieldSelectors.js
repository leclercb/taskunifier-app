import { createSelector } from 'reselect';
import { getDefaultTaskFields } from 'data/DataTaskFields';
import { filterByVisibleState } from 'utils/CategoryUtils';

const getTaskFields = state => state.taskFields;
const getSettings = state => state.settings;

export const getTaskFieldsFilteredByVisibleState = createSelector(
    [getTaskFields],
    (taskFields) => {
        return filterByVisibleState(taskFields.all);
    }
);

export const getTaskFieldsIncludingDefaults = createSelector(
    [getTaskFields, getSettings],
    (taskFields, settings) => {
        return getDefaultTaskFields(settings).concat(filterByVisibleState(taskFields.all));
    }
);