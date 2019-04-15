import { loadFromFile, saveToFile } from '../utils/ActionUtils';

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
        return dispatch(loadFromFile('settings', file, data => dispatch(setSettings(data))));
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