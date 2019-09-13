import moment from 'moment';
import uuid from 'uuid/v4';
import { createDirectory, getUserDataPath } from 'actions/ActionUtils';
import { cleanContacts, loadContactsFromFile, loadContactsFromServer, saveContactsToFile, setContacts } from 'actions/ContactActions';
import { cleanContexts, loadContextsFromFile, loadContextsFromServer, saveContextsToFile, setContexts } from 'actions/ContextActions';
import { cleanFolders, loadFoldersFromFile, loadFoldersFromServer, saveFoldersToFile, setFolders } from 'actions/FolderActions';
import { cleanGoals, loadGoalsFromFile, loadGoalsFromServer, saveGoalsToFile, setGoals } from 'actions/GoalActions';
import { cleanLocations, loadLocationsFromFile, loadLocationsFromServer, saveLocationsToFile, setLocations } from 'actions/LocationActions';
import { cleanNotes, loadNotesFromFile, loadNotesFromServer, saveNotesToFile, setNotes } from 'actions/NoteActions';
import { cleanNoteFields, loadNoteFieldsFromFile, loadNoteFieldsFromServer, saveNoteFieldsToFile, setNoteFields } from 'actions/NoteFieldActions';
import { cleanNoteFilters, loadNoteFiltersFromFile, loadNoteFiltersFromServer, saveNoteFiltersToFile, setNoteFilters } from 'actions/NoteFilterActions';
import { checkIsBusy, updateProcess } from 'actions/ThreadActions';
import { loadSettingsFromFile, loadSettingsFromServer, saveSettingsToFile } from 'actions/SettingActions';
import { cleanTasks, loadTasksFromFile, loadTasksFromServer, saveTasksToFile, setTasks } from 'actions/TaskActions';
import { cleanTaskFields, loadTaskFieldsFromFile, loadTaskFieldsFromServer, saveTaskFieldsToFile, setTaskFields } from 'actions/TaskFieldActions';
import { cleanTaskFilters, loadTaskFiltersFromFile, loadTaskFiltersFromServer, saveTaskFiltersToFile, setTaskFilters } from 'actions/TaskFilterActions';
import { cleanTaskTemplates, loadTaskTemplatesFromFile, loadTaskTemplatesFromServer, saveTaskTemplatesToFile, setTaskTemplates } from 'actions/TaskTemplateActions';
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
import { join } from 'utils/ElectronUtils';
import { merge } from 'utils/ObjectUtils';
import { filterSettings } from 'utils/SettingUtils';

export function loadData(options) {
    if (process.env.REACT_APP_MODE === 'electron') {
        return loadDataFromFile(options);
    } else {
        return loadDataFromServer(options);
    }
}

export function loadDataFromFile(options) {
    return _loadDataFromFile(null, options);
}

export function _loadDataFromFile(path, options) {
    options = merge({
        skipSettings: false
    }, options || {});

    return async (dispatch, getState) => {
        await dispatch(checkIsBusy());

        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: 'Load database',
            notify: true
        }));

        try {
            await dispatch(loadSettingsFromFile(join(getUserDataPath(), 'coreSettings.json'), true));

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

            await Promise.all(promises);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return getState();
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR'
            }));

            throw error;
        }
    };
}

export function loadDataFromServer(options) {
    return _loadDataFromServer(options);
}

export function _loadDataFromServer(options) {
    options = merge({
        skipSettings: false
    }, options || {});

    return async (dispatch, getState) => {
        await dispatch(checkIsBusy());

        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: 'Load database',
            notify: true
        }));

        try {
            const promises = [
                dispatch(loadContactsFromServer()),
                dispatch(loadContextsFromServer()),
                dispatch(loadFoldersFromServer()),
                dispatch(loadGoalsFromServer()),
                dispatch(loadLocationsFromServer()),
                dispatch(loadNotesFromServer()),
                dispatch(loadNoteFieldsFromServer()),
                dispatch(loadNoteFiltersFromServer()),
                dispatch(loadTasksFromServer()),
                dispatch(loadTaskFieldsFromServer()),
                dispatch(loadTaskFiltersFromServer()),
                dispatch(loadTaskTemplatesFromServer())
            ];

            if (!options.skipSettings) {
                promises.unshift(dispatch(loadSettingsFromServer()));
            }

            await Promise.all(promises);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return getState();
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR'
            }));

            throw error;
        }
    };
}

export function saveData(options) {
    if (process.env.REACT_APP_MODE === 'electron') {
        return saveDataToFile(options);
    } else {
        throw new Error('Unsupported Operation');
    }
}

export function saveDataToFile(options) {
    return _saveDataToFile(null, options);
}

export function _saveDataToFile(path, options) {
    options = merge({
        coreSettingsOnly: false,
        clean: false,
        message: null
    }, options || {});

    return async (dispatch, getState) => {
        await checkIsBusy();

        const processId = uuid();
        const state = getState();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: options.message ? options.message : 'Save database',
            notify: true
        }));

        try {
            if (!path) {
                path = getState().settings.dataFolder;
            }

            await createDirectory(path);

            if (options.clean === true) {
                try {
                    await dispatch(cleanData());
                } catch (error) {
                    // Continue
                }
            }

            const promises = [
                dispatch(saveSettingsToFile(join(getUserDataPath(), 'coreSettings.json'), filterSettings(getSettings(state), true)))
            ];

            if (!options.coreSettingsOnly) {
                promises.push(
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
                );
            }

            await Promise.all(promises);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR'
            }));

            throw error;
        }
    };
}

export function cleanData() {
    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: 'Clean database',
            notify: true
        }));

        try {
            await Promise.all([
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
            ]);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR'
            }));

            throw error;
        }
    };
}

export function resetData(options) {
    options = merge({
        resetAll: false,
        resetContacts: false,
        resetContexts: false,
        resetFolders: false,
        resetGoals: false,
        resetLocations: false,
        resetNotes: false,
        resetNoteFields: false,
        resetNoteFilters: false,
        resetTasks: false,
        resetTaskFields: false,
        resetTaskFilters: false,
        resetTaskTemplates: false
    }, options || {});

    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: 'Reset database',
            notify: true
        }));

        try {
            const promises = [];

            if (options.resetAll || options.resetContacts) {
                promises.push(dispatch(setContacts()));
            }

            if (options.resetAll || options.resetContexts) {
                promises.push(dispatch(setContexts()));
            }

            if (options.resetAll || options.resetFolders) {
                promises.push(dispatch(setFolders()));
            }

            if (options.resetAll || options.resetGoals) {
                promises.push(dispatch(setGoals()));
            }

            if (options.resetAll || options.resetLocations) {
                promises.push(dispatch(setLocations()));
            }

            if (options.resetAll || options.resetNotes) {
                promises.push(dispatch(setNotes()));
            }

            if (options.resetAll || options.resetNoteFields) {
                promises.push(dispatch(setNoteFields()));
            }

            if (options.resetAll || options.resetNoteFilters) {
                promises.push(dispatch(setNoteFilters()));
            }

            if (options.resetAll || options.resetTasks) {
                promises.push(dispatch(setTasks()));
            }

            if (options.resetAll || options.resetTaskFields) {
                promises.push(dispatch(setTaskFields()));
            }

            if (options.resetAll || options.resetTaskFilters) {
                promises.push(dispatch(setTaskFilters()));
            }

            if (options.resetAll || options.resetTaskTemplates) {
                promises.push(dispatch(setTaskTemplates()));
            }

            await Promise.all(promises);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR'
            }));

            throw error;
        }
    };
}

export function setEditingCell(objectId, fieldId) {
    return async dispatch => {
        dispatch({
            type: 'SET_EDITING_CELL',
            objectId,
            fieldId
        });
    };
}

export function setSelectedNoteIds(noteIds) {
    return async dispatch => {
        dispatch({
            type: 'SET_SELECTED_NOTE_IDS',
            noteIds
        });
    };
}

export function setSelectedNoteFilter(noteFilter) {
    return async dispatch => {
        dispatch({
            type: 'SET_SELECTED_NOTE_FILTER',
            noteFilter,
            date: moment().toISOString()
        });
    };
}

export function setSelectedTaskIds(taskIds) {
    return async dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_IDS',
            taskIds
        });
    };
}

export function setSelectedTaskFilter(taskFilter) {
    return async dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_FILTER',
            taskFilter,
            date: moment().toISOString()
        });
    };
}

export function setJoyrideOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_JOYRIDE_OPTIONS',
            ...options
        });
    };
}

export function setBatchAddTasksManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_BATCH_ADD_TASKS_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setBatchEditTasksManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_BATCH_EDIT_TASKS_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setCategoryManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_CATEGORY_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setReminderManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_REMINDER_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setNoteFieldManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_NOTE_FIELD_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setNoteFilterManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_NOTE_FILTER_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setTaskFieldManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_TASK_FIELD_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setTaskFilterManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_TASK_FILTER_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setTaskEditionManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_TASK_EDITION_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setTaskTemplateManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_TASK_TEMPLATE_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setSettingManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_SETTING_MANAGER_OPTIONS',
            ...options
        });
    };
}