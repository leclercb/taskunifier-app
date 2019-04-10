import { loadFromFile, saveToFile } from './ActionUtils';

export const setSettingsVisible = visible => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SETTINGS_VISIBLE',
            visible: visible
        });

        return Promise.resolve();
    };
};

export const loadSettingsFromFile = file => {
    return (dispatch, getState) => {
        return loadFromFile('settings', file, data => setSettings(data)(dispatch, getState))(dispatch, getState);
    };
};

export const saveSettingsToFile = (file, data) => {
    return saveToFile('settings', file, data);
};

export const setSettings = settings => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SETTINGS',
            settings: settings
        });

        return Promise.resolve();
    };
};

export const updateSettings = settings => {
    return (dispatch, getState) => {
        dispatch({
            type: 'UPDATE_SETTINGS',
            settings: settings
        });

        return Promise.resolve();
    };
};