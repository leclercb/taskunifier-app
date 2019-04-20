import uuid from 'uuid';
import moment from 'moment';
import { loadContactsFromFile, saveContactsToFile, cleanContacts } from './ContactActions';
import { loadContextsFromFile, saveContextsToFile, cleanContexts } from './ContextActions';
import { loadFieldsFromFile, saveFieldsToFile, cleanFields } from './FieldActions';
import { loadFoldersFromFile, saveFoldersToFile, cleanFolders } from './FolderActions';
import { loadGoalsFromFile, saveGoalsToFile, cleanGoals } from './GoalActions';
import { loadLocationsFromFile, saveLocationsToFile, cleanLocations } from './LocationActions';
import { loadTasksFromFile, saveTasksToFile, cleanTasks } from './TaskActions';
import { loadTaskFiltersFromFile, saveTaskFiltersToFile, cleanTaskFilters } from './TaskFilterActions';
import { loadTaskTemplatesFromFile, saveTaskTemplatesToFile, cleanTaskTemplates } from './TaskTemplateActions';
import { updateProcess } from './ProcessActions';
import { saveSettingsToFile, loadSettingsFromFile } from './SettingActions';
import { createDirectory, getUserDataPath, join, deleteDirectory } from '../utils/ActionUtils';
import { getBackups } from '../utils/BackupUtils';

const _loadData = (path, options = {}) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            if (!path) {
                path = getUserDataPath();
            }

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Load database',
                notify: true
            }));

            Promise.all([
                dispatch(loadSettingsFromFile(join(path, 'settings.json'))),
                dispatch(loadContactsFromFile(join(path, 'contacts.json'))),
                dispatch(loadContextsFromFile(join(path, 'contexts.json'))),
                dispatch(loadFieldsFromFile(join(path, 'fields.json'))),
                dispatch(loadFoldersFromFile(join(path, 'folders.json'))),
                dispatch(loadGoalsFromFile(join(path, 'goals.json'))),
                dispatch(loadLocationsFromFile(join(path, 'locations.json'))),
                dispatch(loadTasksFromFile(join(path, 'tasks.json'))),
                dispatch(loadTaskFiltersFromFile(join(path, 'taskFilters.json'))),
                dispatch(loadTaskTemplatesFromFile(join(path, 'taskTemplates.json')))
            ]).then(() => {
                dispatch(updateProcess({
                    id: processId,
                    state: 'COMPLETED'
                }, true));

                resolve(getState());
            }).catch(() => {
                dispatch(updateProcess({
                    id: processId,
                    state: 'ERROR'
                }));

                reject();
            });
        });
    };
};

export const loadData = options => _loadData(null, options);

const _saveData = (path, options = { clean: false, message: null }) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();
            const state = getState();

            if (!path) {
                path = getUserDataPath();
            }

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: options.message ? options.message : 'Save database',
                notify: true
            }));

            createDirectory(path);

            const saveAllFn = () => {
                Promise.all([
                    dispatch(saveSettingsToFile(join(path, 'settings.json'), state.settings)),
                    dispatch(saveContactsToFile(join(path, 'contacts.json'), state.contacts)),
                    dispatch(saveContextsToFile(join(path, 'contexts.json'), state.contexts)),
                    dispatch(saveFieldsToFile(join(path, 'fields.json'), state.fields)),
                    dispatch(saveFoldersToFile(join(path, 'folders.json'), state.folders)),
                    dispatch(saveGoalsToFile(join(path, 'goals.json'), state.goals)),
                    dispatch(saveLocationsToFile(join(path, 'locations.json'), state.locations)),
                    dispatch(saveTasksToFile(join(path, 'tasks.json'), state.tasks)),
                    dispatch(saveTaskFiltersToFile(join(path, 'taskFilters.json'), state.taskFilters)),
                    dispatch(saveTaskTemplatesToFile(join(path, 'taskTemplates.json'), state.taskTemplates))
                ]).then(() => {
                    dispatch(updateProcess({
                        id: processId,
                        state: 'COMPLETED'
                    }));

                    resolve();
                }).catch(() => {
                    dispatch(updateProcess({
                        id: processId,
                        state: 'ERROR'
                    }));

                    reject();
                });
            };

            if (options.clean === true) {
                dispatch(cleanData()).finally(() => saveAllFn());
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

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Clean database',
                notify: true
            }));

            Promise.all([
                dispatch(cleanContacts()),
                dispatch(cleanContexts()),
                dispatch(cleanFields()),
                dispatch(cleanTaskFilters()),
                dispatch(cleanFolders()),
                dispatch(cleanGoals()),
                dispatch(cleanLocations()),
                dispatch(cleanTasks()),
                dispatch(cleanTaskTemplates())
            ]).then(() => {
                dispatch(updateProcess({
                    id: processId,
                    state: 'COMPLETED'
                }));

                resolve();
            }).catch(() => {
                dispatch(updateProcess({
                    id: processId,
                    state: 'ERROR'
                }));

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

    return (dispatch, getState) => {
        return new Promise(resolve => {
            const promise = dispatch(_saveData(join(getUserDataPath(), 'backups', '' + Date.now().valueOf()), { message: 'Backup database' }));

            promise.then(() => {
                dispatch(cleanBackups());
                resolve();
            });
        });
    };
};

export const deleteBackup = date => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: `Delete backup "${moment(Number(date)).format('DD-MM-YYYY HH:mm:ss')}"`
            }));

            try {
                deleteDirectory(join(getUserDataPath(), 'backups', '' + date));

                dispatch(updateProcess({
                    id: processId,
                    state: 'COMPLETED'
                }));

                resolve();
            } catch (err) {
                dispatch(updateProcess({
                    id: processId,
                    state: 'ERROR',
                    error: err.toString()
                }));

                reject();
            }
        });
    };
}

export const cleanBackups = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();
            const maxBackups = getState().settings.maxBackups;

            if (!maxBackups) {
                reject();
                return;
            }

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Clean backups',
                notify: true
            }));

            const backups = getBackups().sort((a, b) => Number(a) - Number(b));

            const promises = [];
            for (let index = 0; index < backups.length - maxBackups; index++) {
                promises.push(dispatch(deleteBackup(backups[index])));
            }

            Promise.all(promises).then(() => {
                dispatch(updateProcess({
                    id: processId,
                    state: 'COMPLETED'
                }));

                resolve();
            }).catch(() => {
                dispatch(updateProcess({
                    id: processId,
                    state: 'ERROR'
                }));

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

export const setSelectedTaskIds = taskIds => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SELECTED_TASK_IDS',
            taskIds: taskIds
        });

        return Promise.resolve();
    };
}

export const setSelectedTaskFilter = taskFilter => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SELECTED_TASK_FILTER',
            taskFilter: taskFilter,
            date: moment().toJSON()
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

export const setTaskFilterManagerOptions = (options) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_TASK_FILTER_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};

export const setTaskTemplateManagerOptions = (options) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_TASK_TEMPLATE_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};

export const setSettingManagerOptions = (options) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SETTING_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};

export const setBatchAddTasksOptions = (options) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_BATCH_ADD_TASKS_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};