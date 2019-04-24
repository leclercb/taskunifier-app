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

export const getNoteBackgroundColor = (note, index, settings) => {
    return index % 2 === 0 ? settings.evenColor : settings.oddColor;
}

export const getTaskBackgroundColor = (task, index, settings) => {
    if (settings.showImportanceColor) {
        return getImportanceColor(task.importance, settings);
    }

    return index % 2 === 0 ? settings.evenColor : settings.oddColor;
}