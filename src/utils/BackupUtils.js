import moment from 'moment';

export function isAutomaticBackupEnabled(settings) {
    const { automaticBackup, automaticBackupInterval } = settings;

    if (automaticBackup &&
        Number.isInteger(automaticBackupInterval) &&
        automaticBackupInterval > 0) {
        return true;
    }

    return false;
}

export function getSecondsSinceLastBackup(settings) {
    const enabled = isAutomaticBackupEnabled(settings);

    if (!enabled) {
        return -1;
    }

    if (!settings.lastBackupDate) {
        return Number.MAX_SAFE_INTEGER;
    }

    return moment().diff(moment(settings.lastBackupDate), 'second');
}

export function getSecondsUntilNextBackup(settings) {
    const seconds = getSecondsSinceLastBackup(settings);

    if (seconds < 0) {
        return seconds;
    }

    return Math.max(0, (settings.automaticBackupInterval * 60) - seconds);
}

export function isAutomaticBackupNeeded(settings) {
    const seconds = getSecondsSinceLastBackup(settings);

    if (seconds < 0) {
        return false;
    }

    return (seconds > settings.automaticBackupInterval * 60);
}