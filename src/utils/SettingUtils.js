import { isCoreSetting } from '../data/DataSettings';

export const filterSettings = (settings, core) => {
    const newSettings = {};

    Object.keys(settings).forEach(settingId => {
        if ((core && isCoreSetting(settingId)) || (!core && !isCoreSetting(settingId))) {
            newSettings[settingId] = settings[settingId];
            return;
        }
    })

    return newSettings;
}

export const getImportanceColor = (importance, settings) => {
    return settings['importance_' + (importance ? importance : 0)];
}

export const getPriorityColor = (priority, settings) => {
    return settings['priority_' + (priority ? priority : 'negative')];
}

export const getStatusColor = (status, settings) => {
    return settings['status_' + (status ? status : 'negative')];
}