import uuid from 'uuid';

import { loadFoldersFromFile, saveFoldersToFile, cleanFolders } from './FolderActions';
import { loadContextsFromFile, saveContextsToFile, cleanContexts } from './ContextActions';
import { loadFieldsFromFile, saveFieldsToFile, cleanFields } from './FieldActions';
import { loadFiltersFromFile, saveFiltersToFile, cleanFilters } from './FilterActions';
import { loadTasksFromFile, saveTasksToFile, cleanTasks } from './TaskActions';
import { clearProcesses, updateProcess } from './StatusActions';
import { saveSettingsToFile, loadSettingsFromFile } from './SettingActions';
import { loadGoalsFromFile, saveGoalsToFile, cleanGoals } from './GoalActions';
import { loadLocationsFromFile, saveLocationsToFile, cleanLocations } from './LocationActions';
import { createDirectory, getDirectories } from './ActionUtils';

export const loadData = path => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            if (!path) {
                path = 'data/';
            }

            updateProcess(processId, 'RUNNING', 'Load database')(dispatch, getState);

            Promise.all([
                loadSettingsFromFile(path + "settings.json")(dispatch, getState),
                loadContextsFromFile(path + "contexts.json")(dispatch, getState),
                loadFieldsFromFile(path + "fields.json")(dispatch, getState),
                loadFiltersFromFile(path + "filters.json")(dispatch, getState),
                loadFoldersFromFile(path + "folders.json")(dispatch, getState),
                loadGoalsFromFile(path + "goals.json")(dispatch, getState),
                loadLocationsFromFile(path + "locations.json")(dispatch, getState),
                loadTasksFromFile(path + "tasks.json")(dispatch, getState)
            ]).then(() => {
                updateProcess(processId, 'COMPLETED')(dispatch, getState);

                setTimeout(() => {
                    clearProcesses()(dispatch, getState);
                }, 500);

                resolve(getState());
            });
        });
    };
};

export const saveData = path => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();
            const state = getState();

            if (!path) {
                path = 'data/';
            }

            updateProcess(processId, 'RUNNING', 'Save database')(dispatch, getState);

            createDirectory(path);

            Promise.all([
                saveSettingsToFile(path + "settings.json", state.settings.data)(dispatch, getState),
                saveContextsToFile(path + "contexts.json", state.contexts)(dispatch, getState),
                saveFieldsToFile(path + "fields.json", state.fields)(dispatch, getState),
                saveFiltersToFile(path + "filters.json", state.filters)(dispatch, getState),
                saveFoldersToFile(path + "folders.json", state.folders)(dispatch, getState),
                saveGoalsToFile(path + "goals.json", state.goals)(dispatch, getState),
                saveLocationsToFile(path + "locations.json", state.locations)(dispatch, getState),
                saveTasksToFile(path + "tasks.json", state.tasks)(dispatch, getState)
            ]).then(() => {
                updateProcess(processId, 'COMPLETED')(dispatch, getState);

                setTimeout(() => {
                    clearProcesses()(dispatch, getState);
                }, 500);

                resolve();
            });
        });
    };
};

export const getBackups = () => {
    return getDirectories("data/backups");
}

export const restoreBackup = backupId => {
    return loadData("data/backups/" + backupId + "/");
}

export const backupData = () => {
    return saveData("data/backups/" + Date.now() + "/");
}

export const cleanData = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            updateProcess(processId, 'RUNNING', 'Clean database')(dispatch, getState);

            Promise.all([
                cleanContexts()(dispatch, getState),
                cleanFields()(dispatch, getState),
                cleanFilters()(dispatch, getState),
                cleanFolders()(dispatch, getState),
                cleanGoals()(dispatch, getState),
                cleanLocations()(dispatch, getState),
                cleanTasks()(dispatch, getState),
            ]).then(() => {
                updateProcess(processId, 'COMPLETED')(dispatch, getState);

                setTimeout(() => {
                    clearProcesses()(dispatch, getState);
                }, 500);

                resolve();
            });
        });
    };
}

export const synchronize = () => {
    return (dispatch, getState) => {
        return Promise.resolve();
    };
};

export const setSelectedFilter = filter => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SELECTED_FILTER',
            filter: filter
        });

        return Promise.resolve();
    };
};

export const setCategoryManagerOptions = (options) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_CATEGORY_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};

export const setFilterManagerOptions = (options) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_FILTER_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};