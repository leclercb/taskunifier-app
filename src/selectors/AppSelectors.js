import { createSelector } from 'reselect';
import { getSession } from 'selectors/SessionSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { verifyLicense } from 'utils/LicenseUtils';

export const getEditingCell = state => state.app.editingCell;

export const getSelectedNoteIds = state => state.app.selectedNoteIds;
export const getSelectedNoteFilter = state => state.app.selectedNoteFilter;
export const getSelectedNoteFilterDate = state => state.app.selectedNoteFilterDate;

export const getSelectedTaskIds = state => state.app.selectedTaskIds;
export const getSelectedTaskFilter = state => state.app.selectedTaskFilter;
export const getSelectedTaskFilterDate = state => state.app.selectedTaskFilterDate;

export const getJoyrideOptions = state => state.app.joyride;

export const getBatchAddTasksManager = state => state.app.batchAddTasksManager;
export const getBatchEditTasksManager = state => state.app.batchEditTasksManager;
export const getCategoryManager = state => state.app.categoryManager;
export const getReminderManager = state => state.app.reminderManager;
export const getNoteFieldManager = state => state.app.noteFieldManager;
export const getNoteFilterManager = state => state.app.noteFilterManager;
export const getTaskFieldManager = state => state.app.taskFieldManager;
export const getTaskFilterManager = state => state.app.taskFilterManager;
export const getTaskEditionManager = state => state.app.taskEditionManager;
export const getTaskTemplateManager = state => state.app.taskTemplateManager;
export const getSettingManager = state => state.app.settingManager;

export const isValidLicense = createSelector(
    getSettings,
    settings => !!verifyLicense(settings.license)
);

export const isPro = createSelector(
    isValidLicense,
    getSession,
    (isValidLicense, session) => {
        if (process.env.REACT_APP_MODE === 'electron') {
            return isValidLicense;
        } else {
            return session.user ? session.user.metaData.computedSubscriptionType === 'pro' : false;
        }
    }
);