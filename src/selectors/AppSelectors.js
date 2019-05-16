import { createSelector } from 'reselect';
import { getSettings } from 'selectors/SettingSelectors';
import { verifyLicense } from 'utils/LicenseUtils';

export const getSelectedView = state => state.app.selectedView;
export const getSelectedNoteIds = state => state.app.selectedNoteIds;
export const getSelectedNoteFilter = state => state.app.selectedNoteFilter;
export const getSelectedNoteFilterDate = state => state.app.selectedNoteFilterDate;
export const isShowCompletedTasks = state => state.app.showCompletedTasks;
export const getCalendarDateMode = state => state.app.calendarDateMode;
export const getSelectedTaskIds = state => state.app.selectedTaskIds;
export const getSelectedTaskFilter = state => state.app.selectedTaskFilter;
export const getSelectedTaskFilterDate = state => state.app.selectedTaskFilterDate;
export const getBatchAddTasksManager = state => state.app.batchAddTasksManager;
export const getBatchEditTasksManager = state => state.app.batchEditTasksManager;
export const getCategoryManager = state => state.app.categoryManager;
export const getNoteFilterManager = state => state.app.noteFilterManager;
export const getTaskFilterManager = state => state.app.taskFilterManager;
export const getTaskEditionManager = state => state.app.taskEditionManager;
export const getTaskTemplateManager = state => state.app.taskTemplateManager;
export const getSettingManager = state => state.app.settingManager;

export const isValidLicense = createSelector(
    getSettings,
    (settings) => {
        return verifyLicense(settings.license) !== null;
    }
);