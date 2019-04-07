import { loadFoldersFromFile, saveFoldersToFile } from './FolderActions';
import { loadContextsFromFile, saveContextsToFile } from './ContextActions';
import { loadFieldsFromFile, saveFieldsToFile } from './FieldActions';
import { loadFiltersFromFile, saveFiltersToFile } from './FilterActions';
import { loadTasksFromFile, saveTasksToFile } from './TaskActions';
import { setStatusVisible } from './StatusActions';
import { saveSettingsToFile, loadSettingsFromFile } from './SettingActions';

export const loadData = () => {
    return (dispatch, getState) => {
        setStatusVisible(true)(dispatch, getState);

        loadSettingsFromFile("data/settings.json")(dispatch, getState);

        loadContextsFromFile("data/contexts.json")(dispatch, getState);
        loadFieldsFromFile("data/fields.json")(dispatch, getState);
        loadFiltersFromFile("data/filters.json")(dispatch, getState);
        loadFoldersFromFile("data/folders.json")(dispatch, getState);
        loadTasksFromFile("data/tasks.json")(dispatch, getState);
    };
};

export const saveData = () => {
    return (dispatch, getState) => {
        setStatusVisible(true)(dispatch, getState);

        saveSettingsToFile("data/settings.json")(dispatch, getState);

        saveContextsToFile("data/contexts.json")(dispatch, getState);
        saveFieldsToFile("data/fields.json")(dispatch, getState);
        saveFiltersToFile("data/filters.json")(dispatch, getState);
        saveFoldersToFile("data/folders.json")(dispatch, getState);
        saveTasksToFile("data/tasks.json")(dispatch, getState);
    };
};

export const synchronize = () => {
    return (dispatch, getState) => {
        setStatusVisible(true)(dispatch, getState);
    };
};

export const setSelectedFilter = filter => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SELECTED_FILTER',
            filter: filter
        });
    };
};