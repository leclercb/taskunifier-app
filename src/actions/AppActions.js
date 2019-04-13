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
import { createDirectory, getDirectories, getUserDataPath, join } from './ActionUtils';

export const loadData = path => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            if (!path) {
                path = getUserDataPath();
            }

            updateProcess(processId, 'RUNNING', 'Load database')(dispatch, getState);

            Promise.all([
                loadSettingsFromFile(join(path, 'settings.json'))(dispatch, getState),
                loadContextsFromFile(join(path, 'contexts.json'))(dispatch, getState),
                loadFieldsFromFile(join(path, 'fields.json'))(dispatch, getState),
                loadFiltersFromFile(join(path, 'filters.json'))(dispatch, getState),
                loadFoldersFromFile(join(path, 'folders.json'))(dispatch, getState),
                loadGoalsFromFile(join(path, 'goals.json'))(dispatch, getState),
                loadLocationsFromFile(join(path, 'locations.json'))(dispatch, getState),
                loadTasksFromFile(join(path, 'tasks.json'))(dispatch, getState)
            ]).then(() => {
                updateProcess(processId, 'COMPLETED')(dispatch, getState);
                resolve(getState());
            }).catch(() => {
                updateProcess(processId, 'ERROR')(dispatch, getState);
                reject();
            }).finally(() => {
                setTimeout(() => {
                    clearProcesses()(dispatch, getState);
                }, 500);
            });
        });
    };
};

export const saveData = (path, clean = false) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();
            const state = getState();

            if (!path) {
                path = getUserDataPath();
            }

            updateProcess(processId, 'RUNNING', 'Save database')(dispatch, getState);

            createDirectory(path);

            const saveAllFn = () => {
                Promise.all([
                    saveSettingsToFile(join(path, 'settings.json'), state.settings.data)(dispatch, getState),
                    saveContextsToFile(join(path, 'contexts.json'), state.contexts)(dispatch, getState),
                    saveFieldsToFile(join(path, 'fields.json'), state.fields)(dispatch, getState),
                    saveFiltersToFile(join(path, 'filters.json'), state.filters)(dispatch, getState),
                    saveFoldersToFile(join(path, 'folders.json'), state.folders)(dispatch, getState),
                    saveGoalsToFile(join(path, 'goals.json'), state.goals)(dispatch, getState),
                    saveLocationsToFile(join(path, 'locations.json'), state.locations)(dispatch, getState),
                    saveTasksToFile(join(path, 'tasks.json'), state.tasks)(dispatch, getState)
                ]).then(() => {
                    updateProcess(processId, 'COMPLETED')(dispatch, getState);
                    resolve();
                }).catch(() => {
                    updateProcess(processId, 'ERROR')(dispatch, getState);
                    reject();
                }).finally(() => {
                    setTimeout(() => {
                        clearProcesses()(dispatch, getState);
                    }, 500);
                });
            };

            if (clean) {
                cleanData()(dispatch, getState).finally(() => saveAllFn());
            } else {
                saveAllFn();
            }
        });
    };
};

export const getBackups = () => {
    return getDirectories(join(getUserDataPath(), 'backups'));
}

export const restoreBackup = backupId => {
    return loadData(join(getUserDataPath(), 'backups', backupId));
}

export const backupData = () => {
    return saveData(join(getUserDataPath(), 'backups', Date.now()));
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
                resolve();
            }).catch(() => {
                updateProcess(processId, 'ERROR')(dispatch, getState);
                reject();
            }).finally(() => {
                setTimeout(() => {
                    clearProcesses()(dispatch, getState);
                }, 500);
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