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
export const getCalendarEventTypes = state => state.settings.calendarEventTypes || [];
export const getCombinedNoteFilterDefinitions = state => state.settings.combinedNoteFilterDefinitions;
export const getCombinedTaskFilterDefinitions = state => state.settings.combinedTaskFilterDefinitions;
export const getNoteColumnSorter = state => state.settings.noteColumnSorter;
export const getCategoryNoteSorters = state => state.settings.categoryNoteSorters;
export const getTaskColumnSorter = state => state.settings.taskColumnSorter;
export const getCategoryTaskSorters = state => state.settings.categoryTaskSorters;