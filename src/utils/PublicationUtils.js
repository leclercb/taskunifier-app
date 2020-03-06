import moment from 'moment';
import { getGoogleCalAccountInfo } from 'actions/publication/googlecal/GoogleCalAccountInfoActions';
import { publishToGoogleCal } from 'actions/publication/googlecal/GoogleCalPublicationActions';

export function getPublicationApp(id) {
    return getPublicationApps().find(app => app.id === id);
}

export function getPublicationAppsById(ids) {
    return getPublicationApps().filter(app => (ids || []).includes(app.id));
}

export function getPublicationApps() {
    return [
        {
            id: 'googlecal',
            label: 'Google Calendar',
            img: 'resources/images/publication/googlecal.png',
            getAccountInfo: getGoogleCalAccountInfo,
            publish: publishToGoogleCal
        }
    ];
}

export function isAutomaticPubEnabled(settings, isPro) {
    const { automaticPublication, automaticPublicationInterval } = settings;

    if (isPro &&
        automaticPublication &&
        Number.isInteger(automaticPublicationInterval) &&
        automaticPublicationInterval > 0) {
        return true;
    }

    return false;
}

export function getSecondsSinceLastPub(settings, isPro) {
    const enabled = isAutomaticPubEnabled(settings, isPro);

    if (!enabled) {
        return -1;
    }

    if (!settings.lastPublicationDate) {
        return Number.MAX_SAFE_INTEGER;
    }

    return moment().diff(moment(settings.lastPublicationDate), 'second');
}

export function getSecondsUntilNextPub(settings, isPro) {
    const seconds = getSecondsSinceLastPub(settings, isPro);

    if (seconds < 0) {
        return seconds;
    }

    return Math.max(0, (settings.automaticPublicationInterval * 60) - seconds);
}

export function isAutomaticPubNeeded(settings, isPro) {
    const seconds = getSecondsSinceLastPub(settings, isPro);

    if (seconds < 0) {
        return false;
    }

    return (seconds > settings.automaticPublicationInterval * 60);
}