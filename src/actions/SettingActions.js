import {
    loadFromFile,
    loadFromServer,
    saveToFile,
    saveToServer
} from 'actions/ActionUtils';

export const loadSettingsFromFile = (file, core = false) => {
    return dispatch => dispatch(loadFromFile('settings', file, data => dispatch(setSettings(data, core))));
};

export function saveSettingsToFile(file, data) {
    return saveToFile('settings', file, data);
}

export const loadSettingsFromServer = (core = false) => {
    return dispatch => dispatch(loadFromServer('settings', data => dispatch(setSettings(data, core))));
};

export function saveSettingsToServer(data) {
    return saveToServer('settings', data);
}

export const setSettings = (settings, core = false) => {
    return async dispatch => {
        dispatch({
            type: 'SET_SETTINGS',
            core,
            settings
        });
    };
};

export function updateSettings(settings) {
    return async dispatch => {
        dispatch({
            type: 'UPDATE_SETTINGS',
            settings
        });
    };
}

export function setSelectedView(view) {
    return updateSettings({
        selectedView: view
    });
}

export function setSelectedCalendarView(view) {
    return updateSettings({
        selectedCalendarView: view
    });
}

export function setShowCompletedTasks(show) {
    return updateSettings({
        showCompletedTasks: show
    });
}

export function setCalendarDateMode(mode) {
    return updateSettings({
        calendarDateMode: mode
    });
}