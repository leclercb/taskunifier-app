import { loadObjectsFromFile, saveObjectsToFile } from './ObjectActions';

export const setSettingsVisible = visible => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SETTINGS_VISIBLE',
            visible: visible
        });
    };
};

export const loadSettingsFromFile = file => {
    return (dispatch, getState) => {
        return loadObjectsFromFile('tasks', file, data => setSettings(data)(dispatch, getState))(dispatch, getState);
    };
};

export const saveSettingsToFile = file => {
    return saveObjectsToFile('tasks', file);
};

export const setSettings = settings => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SETTINGS',
            settings: settings
        });
    };
};

export const updateSettings = settings => {
    return (dispatch, getState) => {
        dispatch({
            type: 'UPDATE_SETTINGS',
            settings: settings
        });
    };
};