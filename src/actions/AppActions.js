import moment from 'moment';
import uuid from 'uuid';
import { createDirectory, getUserDataPath, join } from 'actions/ActionUtils';
import { cleanContacts, loadContactsFromFile, saveContactsToFile } from 'actions/ContactActions';
import { cleanContexts, loadContextsFromFile, saveContextsToFile } from 'actions/ContextActions';
import { cleanFolders, loadFoldersFromFile, saveFoldersToFile } from 'actions/FolderActions';
import { cleanGoals, loadGoalsFromFile, saveGoalsToFile } from 'actions/GoalActions';
import { cleanLocations, loadLocationsFromFile, saveLocationsToFile } from 'actions/LocationActions';
import { cleanNotes, loadNotesFromFile, saveNotesToFile } from 'actions/NoteActions';
import { cleanNoteFields, loadNoteFieldsFromFile, saveNoteFieldsToFile } from 'actions/NoteFieldActions';
import { cleanNoteFilters, loadNoteFiltersFromFile, saveNoteFiltersToFile } from 'actions/NoteFilterActions';
import { updateProcess } from 'actions/ThreadActions';
import { loadSettingsFromFile, saveSettingsToFile } from 'actions/SettingActions';
import { cleanTasks, loadTasksFromFile, saveTasksToFile } from 'actions/TaskActions';
import { cleanTaskFields, loadTaskFieldsFromFile, saveTaskFieldsToFile } from 'actions/TaskFieldActions';
import { cleanTaskFilters, loadTaskFiltersFromFile, saveTaskFiltersToFile } from 'actions/TaskFilterActions';
import { cleanTaskTemplates, loadTaskTemplatesFromFile, saveTaskTemplatesToFile } from 'actions/TaskTemplateActions';
import { getContacts } from 'selectors/ContactSelectors';
import { getContexts } from 'selectors/ContextSelectors';
import { getFolders } from 'selectors/FolderSelectors';
import { getGoals } from 'selectors/GoalSelectors';
import { getLocations } from 'selectors/LocationSelectors';
import { getNotes } from 'selectors/NoteSelectors';
import { getNoteFields } from 'selectors/NoteFieldSelectors';
import { getNoteFilters } from 'selectors/NoteFilterSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTasks } from 'selectors/TaskSelectors';
import { getTaskFields } from 'selectors/TaskFieldSelectors';
import { getTaskFilters } from 'selectors/TaskFilterSelectors';
import { getTaskTemplates } from 'selectors/TaskTemplateSelectors';
import { merge } from 'utils/ObjectUtils';
import { filterSettings } from 'utils/SettingUtils';

export function _loadData(path, options) {
    options = merge({
        skipSettings: false
    }, options || {});

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

                const promises = [
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
                ];

                if (!options.skipSettings) {
                    promises.unshift(dispatch(loadSettingsFromFile(join(path, 'settings.json'))));
                }

                Promise.all(promises).then(() => {
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
}

export function loadData(options) {
    return _loadData(null, options);
}

export function _saveData(path, options) {
    options = merge({
        clean: false,
        message: null
    }, options || {});

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

            const saveAll = () => {
                Promise.all([
                    dispatch(saveSettingsToFile(join(getUserDataPath(), 'coreSettings.json'), filterSettings(getSettings(state), true))),
                    dispatch(saveSettingsToFile(join(path, 'settings.json'), filterSettings(getSettings(state), false))),
                    dispatch(saveContactsToFile(join(path, 'contacts.json'), getContacts(state))),
                    dispatch(saveContextsToFile(join(path, 'contexts.json'), getContexts(state))),
                    dispatch(saveFoldersToFile(join(path, 'folders.json'), getFolders(state))),
                    dispatch(saveGoalsToFile(join(path, 'goals.json'), getGoals(state))),
                    dispatch(saveLocationsToFile(join(path, 'locations.json'), getLocations(state))),
                    dispatch(saveNotesToFile(join(path, 'notes.json'), getNotes(state))),
                    dispatch(saveNoteFieldsToFile(join(path, 'noteFields.json'), getNoteFields(state))),
                    dispatch(saveNoteFiltersToFile(join(path, 'noteFilters.json'), getNoteFilters(state))),
                    dispatch(saveTasksToFile(join(path, 'tasks.json'), getTasks(state))),
                    dispatch(saveTaskFieldsToFile(join(path, 'taskFields.json'), getTaskFields(state))),
                    dispatch(saveTaskFiltersToFile(join(path, 'taskFilters.json'), getTaskFilters(state))),
                    dispatch(saveTaskTemplatesToFile(join(path, 'taskTemplates.json'), getTaskTemplates(state)))
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
                dispatch(cleanData()).finally(() => saveAll());
            } else {
                saveAll();
            }
        });
    };
}

export function saveData(options) {
    return _saveData(null, options);
}

export function cleanData() {
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
}

export function synchronize() {
    return () => {
        return Promise.resolve();
    };
}

export function setSelectedNoteIds(noteIds) {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_NOTE_IDS',
            noteIds
        });

        return Promise.resolve();
    };
}

export function setSelectedNoteFilter(noteFilter) {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_NOTE_FILTER',
            noteFilter,
            date: moment().toISOString()
        });

        return Promise.resolve();
    };
}

export function setSelectedTaskIds(taskIds) {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_IDS',
            taskIds
        });

        return Promise.resolve();
    };
}

export function setSelectedTaskFilter(taskFilter) {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_FILTER',
            taskFilter,
            date: moment().toISOString()
        });

        return Promise.resolve();
    };
}

export function setJoyrideOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_JOYRIDE_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setBatchAddTasksManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_BATCH_ADD_TASKS_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setBatchEditTasksManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_BATCH_EDIT_TASKS_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setCategoryManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_CATEGORY_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setReminderManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_REMINDER_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setTaskFieldManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_TASK_FIELD_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setTaskFilterManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_TASK_FILTER_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setTaskEditionManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_TASK_EDITION_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setTaskTemplateManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_TASK_TEMPLATE_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setNoteFilterManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_NOTE_FILTER_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setNoteTemplateManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_NOTE_TEMPLATE_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setSettingManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_SETTING_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}

export function setSynchronizationManagerOptions(options) {
    return dispatch => {
        dispatch({
            type: 'SET_SYNCHRONIZATION_MANAGER_OPTIONS',
            ...options
        });

        return Promise.resolve();
    };
}