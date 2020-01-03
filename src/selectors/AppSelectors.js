import { createSelector } from 'reselect';
import { getConfig } from 'config/Config';
import { getSession } from 'selectors/SessionSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { verifyLicense } from 'utils/LicenseUtils';
import { getValue } from 'utils/ObjectUtils';

export const getEditingCell = state => state.app.editingCell;

export const getSelectedNoteIds = state => state.app.selectedNoteIds;
export const getSelectedNoteFilter = state => state.app.selectedNoteFilter;
export const getSelectedNoteFilterDate = state => state.app.selectedNoteFilterDate;
export const getSearchNoteValue = state => state.app.searchNoteValue;

export const getSelectedTaskIds = state => state.app.selectedTaskIds;
export const getSelectedTaskFilter = state => state.app.selectedTaskFilter;
export const getSelectedTaskFilterDate = state => state.app.selectedTaskFilterDate;
export const getSearchTaskValue = state => state.app.searchTaskValue;

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
export const getAccountManager = state => state.app.accountManager;
export const getSettingManager = state => state.app.settingManager;

export const getActivationInfo = createSelector(
    getSettings,
    getSession,
    (settings, session) => {
        if (process.env.REACT_APP_MODE === 'electron') {
            const license = verifyLicense(settings.license);

            if (license) {
                return license;
            }

            if (getValue(settings, 'taskunifier.accountInfo.metaData.subscriptionInfo.type', true) === 'pro') {
                return {
                    transaction: null,
                    sku: getConfig().appItemSku,
                    itemSku: getConfig().appItemSku,
                    expirationDate: null,
                    email: getValue(settings, 'taskunifier.accountInfo.email', true)
                };
            }

            return null;
        } else {
            if (session.user && session.user.metaData.subscriptionInfo.type === 'pro') {
                return {
                    transaction: null,
                    sku: getConfig().appItemSku,
                    itemSku: getConfig().appItemSku,
                    expirationDate: null,
                    email: session.user.email
                };
            }

            return null;
        }
    }
);

export const isPro = createSelector(
    getActivationInfo,
    (activationInfo) => {
        return !!activationInfo;
    }
);