import JSZip from 'jszip';
import moment from 'moment';
import { ActionCreators } from 'redux-undo';
import { v4 as uuid } from 'uuid';
import { getDataFolder, getUserDataPath, readBufferFromFile, saveBufferToFile } from 'actions/ActionUtils';
import { cleanContacts, loadContactsFromFile, loadContactsFromServer, saveContactsToFile, setContacts } from 'actions/ContactActions';
import { cleanContexts, loadContextsFromFile, loadContextsFromServer, saveContextsToFile, setContexts } from 'actions/ContextActions';
import { cleanFolders, loadFoldersFromFile, loadFoldersFromServer, saveFoldersToFile, setFolders } from 'actions/FolderActions';
import { cleanGoals, loadGoalsFromFile, loadGoalsFromServer, saveGoalsToFile, setGoals } from 'actions/GoalActions';
import { cleanLocations, loadLocationsFromFile, loadLocationsFromServer, saveLocationsToFile, setLocations } from 'actions/LocationActions';
import { cleanNotes, loadNotesFromFile, loadNotesFromServer, saveNotesToFile, setNotes } from 'actions/NoteActions';
import { cleanNoteFields, loadNoteFieldsFromFile, loadNoteFieldsFromServer, saveNoteFieldsToFile, setNoteFields } from 'actions/NoteFieldActions';
import { cleanNoteFilters, loadNoteFiltersFromFile, loadNoteFiltersFromServer, saveNoteFiltersToFile, setNoteFilters } from 'actions/NoteFilterActions';
import { updateProcess } from 'actions/ThreadActions';
import { loadSettingsFromFile, loadSettingsFromServer, saveSettingsToFile, updateSettings } from 'actions/SettingActions';
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
import { dirname, ensureDir, joinSync } from 'utils/ElectronIpc';
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
    options = Object.assign({
        skipSettings: false,
        zip: false
    }, options);

    return async (dispatch, getState) => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: 'Load database',
            notify: true
        }));

        try {
            if (!options.skipSettings) {
                await dispatch(loadSettingsFromFile(joinSync(getUserDataPath(), 'coreSettings.json'), true));
            }

            if (!path) {
                if (options.zip) {
                    throw new Error('The path is missing');
                }

                path = await getDataFolder(getState().settings);
            }

            let zip = null;

            if (options.zip) {
                zip = new JSZip();
                await zip.loadAsync(await readBufferFromFile(path));
            }

            const getFile = name => {
                if (options.zip) {
                    return {
                        type: 'zip',
                        zip,
                        name
                    };
                }

                return joinSync(path, name);
            };

            const promises = [
                dispatch(loadContactsFromFile(getFile('contacts.json'))),
                dispatch(loadContextsFromFile(getFile('contexts.json'))),
                dispatch(loadFoldersFromFile(getFile('folders.json'))),
                dispatch(loadGoalsFromFile(getFile('goals.json'))),
                dispatch(loadLocationsFromFile(getFile('locations.json'))),
                dispatch(loadNotesFromFile(getFile('notes.json'))),
                dispatch(loadNoteFieldsFromFile(getFile('noteFields.json'))),
                dispatch(loadNoteFiltersFromFile(getFile('noteFilters.json'))),
                dispatch(loadTasksFromFile(getFile('tasks.json'))),
                dispatch(loadTaskFieldsFromFile(getFile('taskFields.json'))),
                dispatch(loadTaskFiltersFromFile(getFile('taskFilters.json'))),
                dispatch(loadTaskTemplatesFromFile(getFile('taskTemplates.json')))
            ];

            if (!options.skipSettings) {
                promises.unshift(dispatch(loadSettingsFromFile(getFile('settings.json'))));
            }

            await Promise.all(promises);

            await dispatch(ActionCreators.clearHistory());
            await dispatch(refreshDataUuid());

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return getState();
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function loadDataFromServer(options) {
    return _loadDataFromServer(options);
}

export function _loadDataFromServer(options) {
    options = Object.assign({
        skipSettings: false
    }, options);

    return async (dispatch, getState) => {
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

            await dispatch(ActionCreators.clearHistory());
            await dispatch(refreshDataUuid());

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return getState();
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function saveData(options) {
    if (process.env.REACT_APP_MODE === 'electron') {
        return async dispatch => {
            await dispatch(saveDataToFile(options));

            await dispatch(updateSettings({
                lastSaveDate: moment().toISOString()
            }));
        };
    } else {
        throw new Error('Unsupported Operation');
    }
}

export function saveDataToFile(options) {
    return _saveDataToFile(null, options);
}

export function _saveDataToFile(path, options) {
    options = Object.assign({
        coreSettingsOnly: false,
        clean: false,
        message: null,
        zip: false
    }, options);

    return async (dispatch, getState) => {
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
                if (options.zip) {
                    throw new Error('The path is missing');
                }

                path = await getDataFolder(getState().settings);
            }

            if (options.zip) {
                await ensureDir(await dirname(path));
            } else {
                await ensureDir(path);
            }

            if (options.clean === true) {
                try {
                    await dispatch(cleanData());
                } catch (error) {
                    // Continue
                }
            }

            const promises = [
                dispatch(saveSettingsToFile(joinSync(getUserDataPath(), 'coreSettings.json'), filterSettings(getSettings(state), true)))
            ];

            let zip = null;

            if (!options.coreSettingsOnly) {
                if (options.zip) {
                    zip = new JSZip();
                }

                const getFile = name => {
                    if (options.zip) {
                        return {
                            type: 'zip',
                            zip,
                            name
                        };
                    }

                    return joinSync(path, name);
                };

                promises.push(
                    dispatch(saveSettingsToFile(getFile('settings.json'), filterSettings(getSettings(state), false))),
                    dispatch(saveContactsToFile(getFile('contacts.json'), getContacts(state))),
                    dispatch(saveContextsToFile(getFile('contexts.json'), getContexts(state))),
                    dispatch(saveFoldersToFile(getFile('folders.json'), getFolders(state))),
                    dispatch(saveGoalsToFile(getFile('goals.json'), getGoals(state))),
                    dispatch(saveLocationsToFile(getFile('locations.json'), getLocations(state))),
                    dispatch(saveNotesToFile(getFile('notes.json'), getNotes(state))),
                    dispatch(saveNoteFieldsToFile(getFile('noteFields.json'), getNoteFields(state))),
                    dispatch(saveNoteFiltersToFile(getFile('noteFilters.json'), getNoteFilters(state))),
                    dispatch(saveTasksToFile(getFile('tasks.json'), getTasks(state))),
                    dispatch(saveTaskFieldsToFile(getFile('taskFields.json'), getTaskFields(state))),
                    dispatch(saveTaskFiltersToFile(getFile('taskFilters.json'), getTaskFilters(state))),
                    dispatch(saveTaskTemplatesToFile(getFile('taskTemplates.json'), getTaskTemplates(state)))
                );
            }

            await Promise.all(promises);

            if (!options.coreSettingsOnly && options.zip) {
                const zipContent = await zip.generateAsync({
                    type: 'nodebuffer',
                    compression: 'DEFLATE',
                    compressionOptions: {
                        level: 9
                    }
                });

                await saveBufferToFile(path, zipContent);
            }

            await dispatch(ActionCreators.clearHistory());

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
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

            await dispatch(ActionCreators.clearHistory());

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function resetData(options) {
    options = Object.assign({
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
    }, options);

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

            await dispatch(ActionCreators.clearHistory());

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

function refreshDataUuid() {
    return async dispatch => {
        dispatch({
            type: 'SET_DATA_UUID',
            uuid: uuid()
        });
    };
}

export function updateMinuteTimer() {
    return async dispatch => {
        dispatch({
            type: 'SET_MINUTE_TIMER',
            date: moment().toISOString()
        });
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

export function setSelectedNoteFilterDefinition(noteFilterDefinition) {
    return async dispatch => {
        dispatch({
            type: 'SET_SELECTED_NOTE_FILTER_DEFINITION',
            noteFilterDefinition,
            date: moment().toISOString()
        });
    };
}

export function setNoteFilterCounts(counts) {
    return async dispatch => {
        dispatch({
            type: 'SET_NOTE_FILTER_COUNTS',
            counts
        });
    };
}

export function setSearchNoteValue(value) {
    return async dispatch => {
        dispatch({
            type: 'SET_SEARCH_NOTE_VALUE',
            value
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

export function setSelectedTaskFilterDefinition(taskFilterDefinition) {
    return async dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_FILTER_DEFINITION',
            taskFilterDefinition,
            date: moment().toISOString()
        });
    };
}

export function setTaskFilterCounts(counts) {
    return async dispatch => {
        dispatch({
            type: 'SET_TASK_FILTER_COUNTS',
            counts
        });
    };
}

export function setSearchTaskValue(value) {
    return async dispatch => {
        dispatch({
            type: 'SET_SEARCH_TASK_VALUE',
            value
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

export function setAccountManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_ACCOUNT_MANAGER_OPTIONS',
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