import { createSelector } from 'reselect';
import { getConfig } from 'config/Config';
import { createNoteFilterFromDefinition, getDefaultSelectedNoteFilter } from 'data/DataNoteFilters';
import { createTaskFilterFromDefinition, getDefaultSelectedTaskFilter } from 'data/DataTaskFilters';
import { getNoteFiltersFilteredByVisibleState } from 'selectors/NoteFilterSelectors';
import { getSession } from 'selectors/SessionSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTaskFiltersFilteredByVisibleState } from 'selectors/TaskFilterSelectors';
import { verifyLicense } from 'utils/LicenseUtils';
import { getValue } from 'utils/ObjectUtils';

export const getDataUuid = state => state.app.dataUuid;
export const getStartDate = state => state.app.startDate;
export const getMinuteTimer = state => state.app.minuteTimer;

export const getEditingCell = state => state.app.editingCell;

export const getSelectedNoteIds = state => state.app.selectedNoteIds;
export const getSelectedNoteFilterDefinition = state => state.settings.selectedNoteFilterDefinition;
export const getSelectedNoteFilterId = state => state.settings.selectedNoteFilterDefinition ? state.settings.selectedNoteFilterDefinition.id : null;
export const getSelectedNoteFilterDate = state => state.app.selectedNoteFilterDate;
export const getSearchNoteValue = state => state.app.searchNoteValue;

export const getSelectedTaskIds = state => state.app.selectedTaskIds;
export const getSelectedTaskFilterDefinition = state => state.settings.selectedTaskFilterDefinition;
export const getSelectedTaskFilterId = state => state.settings.selectedTaskFilterDefinition ? state.settings.selectedTaskFilterDefinition.id : null;
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

export const getSelectedNoteFilter = createSelector(
    getSelectedNoteFilterDefinition,
    getNoteFiltersFilteredByVisibleState,
    getSettings,
    (filterDefinition, filters, settings) => {
        const filter = createNoteFilterFromDefinition(filterDefinition, filters, settings);
        return filter ? filter : getDefaultSelectedNoteFilter();
    }
);

export const getSelectedTaskFilter = createSelector(
    getSelectedTaskFilterDefinition,
    getTaskFiltersFilteredByVisibleState,
    getSettings,
    (filterDefinition, filters, settings) => {
        const filter = createTaskFilterFromDefinition(filterDefinition, filters, settings);
        return filter ? filter : getDefaultSelectedTaskFilter();
    }
);