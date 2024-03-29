import { createSelector } from 'reselect';
import { getConfig } from 'config/Config';
import { createNoteFilterFromDefinition, getDefaultSelectedNoteFilter } from 'data/DataNoteFilters';
import { createTaskFilterFromDefinition, getDefaultSelectedTaskFilter } from 'data/DataTaskFilters';
import { getNoteFiltersFilteredByVisibleState } from 'selectors/NoteFilterSelectors';
import { getSession } from 'selectors/SessionSelectors';
import { getCategoryNoteSorters, getCategoryTaskSorters, getSettings } from 'selectors/SettingSelectors';
import { getTaskFiltersFilteredByVisibleState } from 'selectors/TaskFilterSelectors';
import { verifyLicense } from 'utils/LicenseUtils';
import { getValue } from 'utils/ObjectUtils';

export const getDataUuid = state => state.app.dataUuid;
export const getStartDate = state => state.app.startDate;
export const getMinuteTimer = state => state.app.minuteTimer;

export const getEditingCell = state => state.app.editingCell;

export const getSelectedNoteFilterDefinition = state => state.settings.selectedNoteFilterDefinition;
export const getSelectedNoteFilterId = state => state.settings.selectedNoteFilterDefinition ? state.settings.selectedNoteFilterDefinition.id : null;
export const getSelectedNoteFilterDate = state => state.app.selectedNoteFilterDate;
export const getNoteFilterCounts = state => state.app.noteFilterCounts;
export const getSearchNoteValue = state => state.app.searchNoteValue;

export const getSelectedTaskFilterDefinition = state => state.settings.selectedTaskFilterDefinition;
export const getSelectedTaskFilterId = state => state.settings.selectedTaskFilterDefinition ? state.settings.selectedTaskFilterDefinition.id : null;
export const getSelectedTaskFilterDate = state => state.app.selectedTaskFilterDate;
export const getTaskFilterCounts = state => state.app.taskFilterCounts;
export const getDismissedTaskIds = state => state.app.dismissedTaskIds;
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
    // eslint-disable-next-line no-unused-vars
    (activationInfo) => {
        return true;
    }
);

export const getSelectedNoteFilter = createSelector(
    getSelectedNoteFilterDefinition,
    getNoteFiltersFilteredByVisibleState,
    getCategoryNoteSorters,
    (filterDefinition, filters, sorters) => {
        const filter = createNoteFilterFromDefinition(filterDefinition, filters, sorters);
        return filter ? filter : getDefaultSelectedNoteFilter();
    }
);

export const getSelectedTaskFilter = createSelector(
    getSelectedTaskFilterDefinition,
    getTaskFiltersFilteredByVisibleState,
    getCategoryTaskSorters,
    (filterDefinition, filters, sorters) => {
        const filter = createTaskFilterFromDefinition(filterDefinition, filters, sorters);
        return filter ? filter : getDefaultSelectedTaskFilter();
    }
);