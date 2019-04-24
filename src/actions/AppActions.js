import uuid from 'uuid';
import moment from 'moment';
import { loadContactsFromFile, saveContactsToFile, cleanContacts } from 'actions/ContactActions';
import { loadContextsFromFile, saveContextsToFile, cleanContexts } from 'actions/ContextActions';
import { loadFoldersFromFile, saveFoldersToFile, cleanFolders } from 'actions/FolderActions';
import { loadGoalsFromFile, saveGoalsToFile, cleanGoals } from 'actions/GoalActions';
import { loadLocationsFromFile, saveLocationsToFile, cleanLocations } from 'actions/LocationActions';
import { loadNotesFromFile, saveNotesToFile, cleanNotes } from './NoteActions';
import { loadNoteFieldsFromFile, saveNoteFieldsToFile, cleanNoteFields } from 'actions/NoteFieldActions';
import { loadNoteFiltersFromFile, saveNoteFiltersToFile, cleanNoteFilters } from 'actions/NoteFilterActions';
import { loadTasksFromFile, saveTasksToFile, cleanTasks } from 'actions/TaskActions';
import { loadTaskFieldsFromFile, saveTaskFieldsToFile, cleanTaskFields } from 'actions/TaskFieldActions';
import { loadTaskFiltersFromFile, saveTaskFiltersToFile, cleanTaskFilters } from 'actions/TaskFilterActions';
import { loadTaskTemplatesFromFile, saveTaskTemplatesToFile, cleanTaskTemplates } from 'actions/TaskTemplateActions';
import { updateProcess } from 'actions/ProcessActions';
import { saveSettingsToFile, loadSettingsFromFile } from 'actions/SettingActions';
import { createDirectory, getUserDataPath, join } from 'utils/ActionUtils';
import { filterSettings } from 'utils/SettingUtils';

export const _loadData = path => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Load database',
                notify: true
            }));

            dispatch(loadSettingsFromFile(join(getUserDataPath(), 'coreSettings.json'), true)).then(() => {
                if (!path) {
                    path = getState().settings.dataFolder;
                }

                Promise.all([
                    dispatch(loadSettingsFromFile(join(path, 'settings.json'))),
                    dispatch(loadContactsFromFile(join(path, 'contacts.json'))),
                    dispatch(loadContextsFromFile(join(path, 'contexts.json'))),
                    dispatch(loadFoldersFromFile(join(path, 'folders.json'))),
                    dispatch(loadGoalsFromFile(join(path, 'goals.json'))),
                    dispatch(loadLocationsFromFile(join(path, 'locations.json'))),
                    dispatch(loadNotesFromFile(join(path, 'notes.json'))),
                    dispatch(loadNoteFieldsFromFile(join(path, 'noteFields.json'))),
                    dispatch(loadNoteFiltersFromFile(join(path, 'noteFilters.json'))),
                    dispatch(loadTasksFromFile(join(path, 'tasks.json'))),
                    dispatch(loadTaskFieldsFromFile(join(path, 'taskFields.json'))),
                    dispatch(loadTaskFiltersFromFile(join(path, 'taskFilters.json'))),
                    dispatch(loadTaskTemplatesFromFile(join(path, 'taskTemplates.json')))
                ]).then(() => {
                    dispatch(updateProcess({
                        id: processId,
                        state: 'COMPLETED'
                    }));

                    resolve(getState());
                }).catch(() => {
                    dispatch(updateProcess({
                        id: processId,
                        state: 'ERROR'
                    }));

                    reject();
                });
            });
        });
    };
};

export const loadData = () => _loadData(null);

export const _saveData = (path, options = { clean: false, message: null }) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();
            const state = getState();

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: options.message ? options.message : 'Save database',
                notify: true
            }));

            if (!path) {
                path = getState().settings.dataFolder;
            }

            createDirectory(path);

            const saveAllFn = () => {
                Promise.all([
                    dispatch(saveSettingsToFile(join(getUserDataPath(), 'coreSettings.json'), filterSettings(state.settings, true))),
                    dispatch(saveSettingsToFile(join(path, 'settings.json'), filterSettings(state.settings, false))),
                    dispatch(saveContactsToFile(join(path, 'contacts.json'), state.contacts)),
                    dispatch(saveContextsToFile(join(path, 'contexts.json'), state.contexts)),
                    dispatch(saveFoldersToFile(join(path, 'folders.json'), state.folders)),
                    dispatch(saveGoalsToFile(join(path, 'goals.json'), state.goals)),
                    dispatch(saveLocationsToFile(join(path, 'locations.json'), state.locations)),
                    dispatch(saveNotesToFile(join(path, 'notes.json'), state.notes)),
                    dispatch(saveNoteFieldsToFile(join(path, 'noteFields.json'), state.noteFields)),
                    dispatch(saveNoteFiltersToFile(join(path, 'noteFilters.json'), state.noteFilters)),
                    dispatch(saveTasksToFile(join(path, 'tasks.json'), state.tasks)),
                    dispatch(saveTaskFieldsToFile(join(path, 'taskFields.json'), state.taskFields)),
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
    return dispatch => {
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
                dispatch(cleanFolders()),
                dispatch(cleanGoals()),
                dispatch(cleanLocations()),
                dispatch(cleanNotes()),
                dispatch(cleanNoteFields()),
                dispatch(cleanNoteFilters()),
                dispatch(cleanTasks()),
                dispatch(cleanTaskFields()),
                dispatch(cleanTaskFilters()),
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

export const synchronize = () => {
    return () => {
        return Promise.resolve();
    };
};

export const setSelectedView = view => {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_VIEW',
            view: view
        });

        return Promise.resolve();
    };
};

export const setSelectedTaskIds = taskIds => {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_IDS',
            taskIds: taskIds
        });

        return Promise.resolve();
    };
};

export const setSelectedTaskFilter = taskFilter => {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_FILTER',
            taskFilter: taskFilter,
            date: moment().toJSON()
        });

        return Promise.resolve();
    };
};

export const setSelectedNoteIds = noteIds => {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_NOTE_IDS',
            noteIds: noteIds
        });

        return Promise.resolve();
    };
};

export const setSelectedNoteFilter = noteFilter => {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_NOTE_FILTER',
            noteFilter: noteFilter,
            date: moment().toJSON()
        });

        return Promise.resolve();
    };
};

export const setCategoryManagerOptions = (options) => {
    return dispatch => {
        dispatch({
            type: 'SET_CATEGORY_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};

export const setTaskFilterManagerOptions = (options) => {
    return dispatch => {
        dispatch({
            type: 'SET_TASK_FILTER_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};

export const setTaskTemplateManagerOptions = (options) => {
    return dispatch => {
        dispatch({
            type: 'SET_TASK_TEMPLATE_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};

export const setNoteFilterManagerOptions = (options) => {
    return dispatch => {
        dispatch({
            type: 'SET_NOTE_FILTER_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};

export const setNoteTemplateManagerOptions = (options) => {
    return dispatch => {
        dispatch({
            type: 'SET_NOTE_TEMPLATE_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};

export const setSettingManagerOptions = (options) => {
    return dispatch => {
        dispatch({
            type: 'SET_SETTING_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};

export const setBatchAddTasksOptions = (options) => {
    return dispatch => {
        dispatch({
            type: 'SET_BATCH_ADD_TASKS_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
};