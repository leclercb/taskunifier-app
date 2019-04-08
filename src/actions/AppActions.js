import uuid from 'uuid';

import { loadFoldersFromFile, saveFoldersToFile } from './FolderActions';
import { loadContextsFromFile, saveContextsToFile } from './ContextActions';
import { loadFieldsFromFile, saveFieldsToFile } from './FieldActions';
import { loadFiltersFromFile, saveFiltersToFile } from './FilterActions';
import { loadTasksFromFile, saveTasksToFile } from './TaskActions';
import { clearProcesses, updateProcess } from './StatusActions';
import { saveSettingsToFile, loadSettingsFromFile } from './SettingActions';

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

export const saveData = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();
            const state = getState();

            updateProcess(processId, 'RUNNING', 'Save database')(dispatch, getState);

            Promise.all([
                saveSettingsToFile("data/settings.json", state.settings.data)(dispatch, getState),
                saveContextsToFile("data/contexts.json", state.contexts)(dispatch, getState),
                saveFieldsToFile("data/fields.json", state.fields)(dispatch, getState),
                saveFiltersToFile("data/filters.json", state.filters)(dispatch, getState),
                saveFoldersToFile("data/folders.json", state.folders)(dispatch, getState),
                saveTasksToFile("data/tasks.json", state.tasks)(dispatch, getState)
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

export const setManageCategoriesVisible = visible => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_MANAGE_CATEGORIES_VISIBLE',
            visible: visible
        });

        return Promise.resolve();
    };
};