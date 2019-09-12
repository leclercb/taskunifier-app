import { createSelector } from 'reselect';
import { getDefaultTaskFields } from 'data/DataTaskFields';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';

export const getTaskFields = state => state.taskFields;

export const getTaskFieldsFilteredByVisibleState = createSelector(
    getTaskFields,
    (taskFields) => {
        return filterByVisibleState(taskFields).sort((a, b) => compareStrings(a.title, b.title));
    }
);

export const getTaskFieldsIncludingDefaults = createSelector(
    getTaskFields,
    getSettings,
    (taskFields, settings) => {
        return getDefaultTaskFields(settings).concat(filterByVisibleState(taskFields)).sort((a, b) => compareStrings(a.title, b.title));
    }
);

export const getVisibleTaskFieldSelector = () => createSelector(
    getTaskFieldsFilteredByVisibleState,
    (state, id) => id,
    (taskFields, id) => {
        return taskFields.find(taskField => taskField.id === id);
    }
);