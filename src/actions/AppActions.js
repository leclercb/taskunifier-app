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

const fs = window.require('fs');

export const loadData = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            updateProcess(processId, 'RUNNING', 'Load database')(dispatch, getState);

            Promise.all([
                loadSettingsFromFile("data/settings.json")(dispatch, getState),
                loadContextsFromFile("data/contexts.json")(dispatch, getState),
                loadFieldsFromFile("data/fields.json")(dispatch, getState),
                loadFiltersFromFile("data/filters.json")(dispatch, getState),
                loadFoldersFromFile("data/folders.json")(dispatch, getState),
                loadGoalsFromFile("data/goals.json")(dispatch, getState),
                loadLocationsFromFile("data/locations.json")(dispatch, getState),
                loadTasksFromFile("data/tasks.json")(dispatch, getState)
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

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, {
                    recursive: true
                });
            }

            Promise.all([
                saveSettingsToFile(path + "settings.json", state.settings.data)(dispatch, getState),
                saveContextsToFile(path + "contexts.json", state.contexts)(dispatch, getState),
                saveFieldsToFile(path + "fields.json", state.fields)(dispatch, getState),
                saveFiltersToFile(path + "filters.json", state.filters)(dispatch, getState),
                saveFoldersToFile(path + "folders.json", state.folders)(dispatch, getState),
                saveGoalsToFile(path + "goals.json", state.folders)(dispatch, getState),
                saveLocationsToFile(path + "locations.json", state.folders)(dispatch, getState),
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
            type: 'SET_CATEGORY_MANAGER_VISIBLE',
            ...options
        });

        return Promise.resolve();
    };
};