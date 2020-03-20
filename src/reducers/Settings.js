import moment from 'moment';
import { getSettingValues, isCoreSetting } from 'data/DataSettings';

const Settings = () => (state = {
    ...getSettingValues()
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
                ...getSettingValues(),
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
        case 'SET_SELECTED_NOTE_FILTER_DEFINITION':
            return {
                ...state,
                selectedNoteFilterDefinition: 'noteFilterDefinition' in action ? action.noteFilterDefinition : state.selectedNoteFilterDefinition
            };
        case 'SET_SELECTED_TASK_FILTER_DEFINITION':
            return {
                ...state,
                selectedTaskFilterDefinition: 'taskFilterDefinition' in action ? action.taskFilterDefinition : state.selectedTaskFilterDefinition
            };
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