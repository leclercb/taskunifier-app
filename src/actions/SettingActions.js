import { loadFromFile, saveToFile } from 'actions/ActionUtils';

export const loadSettingsFromFile = (file, core = false) => {
    return dispatch => dispatch(loadFromFile('settings', file, data => dispatch(setSettings(data, core))));
};

export function saveSettingsToFile(file, data) {
    return saveToFile('settings', file, data);
}

export const setSettings = (settings, core = false) => {
    return dispatch => {
        dispatch({
            type: 'SET_SETTINGS',
            core,
            settings
        });

        return Promise.resolve();
    };
};

export function updateSettings(settings) {
    return dispatch => {
        dispatch({
            type: 'UPDATE_SETTINGS',
            settings
        });

        return Promise.resolve();
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