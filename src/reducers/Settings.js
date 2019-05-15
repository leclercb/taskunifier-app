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

            return {
                ...getSettings(),
                ...action.settings,
                ...coreSettings
            };
        }
        case 'UPDATE_SETTINGS': {
            return {
                ...state,
                ...action.settings
            };
        }
        default:
            return state;
    }
};

export default Settings;