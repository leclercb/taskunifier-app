import moment from 'moment';
import { getSettings, isCoreSetting } from 'data/DataSettings';

const Settings = () => (state = {
    ...getSettings()
}, action) => {
    switch (action.type) {
        case 'SET_SETTINGS': {
            const coreSettings = {};

            if (!action.core) {
                Object.keys(state).forEach(settingId => {
                    if (isCoreSetting(settingId)) {
                        coreSettings[settingId] = state[settingId];
                    }
                });
            }

            const settings = {
                ...getSettings(),
                ...action.settings,
                ...coreSettings
            };

            onUpdateSettings(settings);

            return settings;
        }
        case 'UPDATE_SETTINGS': {
            const settings = {
                ...state,
                ...action.settings
            };

            onUpdateSettings(settings);

            return settings;
        }
        default:
            return state;
    }
};

function onUpdateSettings(settings) {
    moment.updateLocale('en', {
        week: {
            dow: settings.firstDayOfWeek || 0
        }
    });
}

export default Settings;