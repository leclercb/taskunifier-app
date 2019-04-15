import uuid from 'uuid';
import moment from 'moment';
import { loadFoldersFromFile, saveFoldersToFile, cleanFolders } from './FolderActions';
import { loadContextsFromFile, saveContextsToFile, cleanContexts } from './ContextActions';
import { loadFieldsFromFile, saveFieldsToFile, cleanFields } from './FieldActions';
import { loadFiltersFromFile, saveFiltersToFile, cleanFilters } from './FilterActions';
import { loadTasksFromFile, saveTasksToFile, cleanTasks } from './TaskActions';
import { updateProcess, setSilent } from './StatusActions';
import { saveSettingsToFile, loadSettingsFromFile } from './SettingActions';
import { loadGoalsFromFile, saveGoalsToFile, cleanGoals } from './GoalActions';
import { loadLocationsFromFile, saveLocationsToFile, cleanLocations } from './LocationActions';
import { createDirectory, getUserDataPath, join, deleteDirectory } from './ActionUtils';
import { getBackups } from './BackupUtils';

const _loadData = (path, options = { silent: false }) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            if (!path) {
                path = getUserDataPath();
            }

            setSilent(options.silent === true)(dispatch, getState);

            updateProcess({
                id: processId,
                status: 'RUNNING',
                title: 'Load database',
                notify: true
            })(dispatch, getState);

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
                updateProcess({
                    id: processId,
                    status: 'COMPLETED'
                }, true)(dispatch, getState);

                resolve(getState());
            }).catch(() => {
                updateProcess({
                    id: processId,
                    status: 'ERROR'
                })(dispatch, getState);

                reject();
            });
        });
    };
};

export const loadData = options => _loadData(null, options);

const _saveData = (path, options = { silent: false, clean: false, message: null }) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();
            const state = getState();

            if (!path) {
                path = getUserDataPath();
            }

            setSilent(options.silent === true)(dispatch, getState);

            updateProcess({
                id: processId,
                status: 'RUNNING',
                title: options.message ? options.message : 'Save database',
                notify: true
            })(dispatch, getState);

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
                    updateProcess({
                        id: processId,
                        status: 'COMPLETED'
                    })(dispatch, getState);

                    resolve();
                }).catch(() => {
                    updateProcess({
                        id: processId,
                        status: 'ERROR'
                    })(dispatch, getState);

                    reject();
                });
            };

            if (options.clean === true) {
                cleanData()(dispatch, getState).finally(() => saveAllFn());
            } else {
                saveAllFn();
            }
        });
    };
};

export const saveData = options => _saveData(null, options);

export const cleanData = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            updateProcess({
                id: processId,
                status: 'RUNNING',
                title: 'Clean database',
                notify: true
            })(dispatch, getState);

            Promise.all([
                cleanContexts()(dispatch, getState),
                cleanFields()(dispatch, getState),
                cleanFilters()(dispatch, getState),
                cleanFolders()(dispatch, getState),
                cleanGoals()(dispatch, getState),
                cleanLocations()(dispatch, getState),
                cleanTasks()(dispatch, getState),
            ]).then(() => {
                updateProcess({
                    id: processId,
                    status: 'COMPLETED'
                })(dispatch, getState);

                resolve();
            }).catch(() => {
                updateProcess({
                    id: processId,
                    status: 'ERROR'
                })(dispatch, getState);

                reject();
            });
        });
    };
};

export const restoreBackup = backupId => {
    createDirectory(join(getUserDataPath(), 'backups'));
    return _loadData(join(getUserDataPath(), 'backups', backupId));
};

export const backupData = () => {
    createDirectory(join(getUserDataPath(), 'backups'));
    return _saveData(join(getUserDataPath(), 'backups', Date.now().toString()), { message: 'Backup database' });
};

export const deleteBackup = date => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            updateProcess({
                id: processId,
                status: 'RUNNING',
                title: `Delete backup "${moment(Number(date)).format('DD-MM-YYYY HH:mm:ss')}"`,
                notify: true
            })(dispatch, getState);

            try {
                deleteDirectory(join(getUserDataPath(), 'backups', date.toString()));
                updateProcess({
                    id: processId,
                    status: 'COMPLETED'
                })(dispatch, getState);

                resolve();
            } catch (err) {
                updateProcess({
                    id: processId,
                    status: 'ERROR',
                    error: err.toString()
                })(dispatch, getState);

                reject();
            }
        });
    };
}

export const cleanBackups = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();
            const maxBackups = getState().settings.data['max_backups'];

            if (!maxBackups) {
                reject();
                return;
            }

            updateProcess({
                id: processId,
                status: 'RUNNING',
                title: 'Clean backups',
                notify: true
            })(dispatch, getState);

            const backups = getBackups().sort((a, b) => Number(a) - Number(b));

            const promises = [];
            for (let index = 0; index < backups.length - maxBackups; index++) {
                promises.push(deleteBackup(backups[index])(dispatch, getState));
            }

            Promise.all(promises).then(() => {
                updateProcess({
                    id: processId,
                    status: 'COMPLETED'
                })(dispatch, getState);

                resolve();
            }).catch(() => {
                updateProcess({
                    id: processId,
                    status: 'ERROR'
                })(dispatch, getState);

                reject();
            });
        });
    };
};

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