import moment from 'moment';

export function isAutomaticSaveEnabled(settings) {
    const { automaticSave, automaticSaveInterval } = settings;

    if (automaticSave &&
        Number.isInteger(automaticSaveInterval) &&
        automaticSaveInterval > 0) {
        return true;
    }

    return false;
}

export function getSecondsSinceLastSave(settings, startDate) {
    const enabled = isAutomaticSaveEnabled(settings);

    if (!enabled) {
        return -1;
    }

    let maxDate = moment(startDate);

    if (settings.lastSaveDate) {
        maxDate = moment.max(moment(startDate), moment(settings.lastSaveDate));
    }

    return moment().diff(maxDate, 'second');
}

export function getSecondsUntilNextSave(settings, startDate) {
    const seconds = getSecondsSinceLastSave(settings, startDate);

    if (seconds < 0) {
        return seconds;
    }

    return Math.max(0, (settings.automaticSaveInterval * 60) - seconds);
}

export function isAutomaticSaveNeeded(settings, startDate) {
    const seconds = getSecondsSinceLastSave(settings, startDate);

    if (seconds < 0) {
        return false;
    }

    return (seconds > settings.automaticSaveInterval * 60);
}