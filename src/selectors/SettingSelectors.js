import { createSelector } from 'reselect';
import { shallowEquals } from 'utils/ObjectUtils';

export const getSettings = state => state.settings;

export const getSettingsSelector = () => {
    let previousValue = {};

    return createSelector(
        getSettings,
        (state, pattern) => pattern instanceof RegExp ? pattern.source : pattern,
        (settings, pattern) => {
            const filteredSettings = Object.keys(settings).reduce((filteredSettings, key) => {
                if (key.match(pattern)) {
                    filteredSettings[key] = settings[key];
                }

                return filteredSettings;
            }, {});

            if (shallowEquals(previousValue, filteredSettings)) {
                return previousValue;
            }

            return filteredSettings;
        });
};

export const getSelectedView = state => state.settings.selectedView;
export const getSelectedCalendarView = state => state.settings.selectedCalendarView;
export const isShowTaskHierarchy = state => state.settings.showTaskHierarchy;
export const isShowCompletedTasks = state => state.settings.showCompletedTasks;
export const isShowFutureTasks = state => state.settings.showFutureTasks;
export const getCalendarDateMode = state => state.settings.calendarDateMode;
export const getCombinedNoteFilterDefinitions = state => state.settings.combinedNoteFilterDefinitions;
export const getCombinedTaskFilterDefinitions = state => state.settings.combinedTaskFilterDefinitions;
export const getCategoryNoteSorters = state => state.settings.categoryNoteSorters;
export const getCategoryTaskSorters = state => state.settings.categoryTaskSorters;