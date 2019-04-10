import uuid from 'uuid';

import { loadFoldersFromFile, saveFoldersToFile } from './FolderActions';
import { loadContextsFromFile, saveContextsToFile } from './ContextActions';
import { loadFieldsFromFile, saveFieldsToFile } from './FieldActions';
import { loadFiltersFromFile, saveFiltersToFile } from './FilterActions';
import { loadTasksFromFile, saveTasksToFile } from './TaskActions';
import { clearProcesses, updateProcess } from './StatusActions';
import { saveSettingsToFile, loadSettingsFromFile } from './SettingActions';
import { loadGoalsFromFile, saveGoalsToFile } from './GoalActions';
import { loadLocationsFromFile, saveLocationsToFile } from './LocationActions';
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

                resolve();
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