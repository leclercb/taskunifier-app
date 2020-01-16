import moment from 'moment';
import { getTaskUnifierAccountInfo } from 'actions/synchronization/taskunifier/TaskUnifierAccountInfoActions';
import { resetDataForTaskUnifierSynchronization, synchronizeWithTaskUnifier } from 'actions/synchronization/taskunifier/TaskUnifierSynchronizationActions';
import { getToodledoAccountInfo } from 'actions/synchronization/toodledo/ToodledoAccountInfoActions';
import { resetDataForToodledoSynchronization, synchronizeWithToodledo } from 'actions/synchronization/toodledo/ToodledoSynchronizationActions';

export function getSynchronizationApp(id) {
    return getSynchronizationApps().find(app => app.id === id);
}

export function getSynchronizationApps() {
    return [
        {
            id: 'taskunifier',
            label: 'TaskUnifier',
            img: 'resources/images/synchronization/taskunifier.png',
            getAccountInfo: getTaskUnifierAccountInfo,
            synchronize: synchronizeWithTaskUnifier,
            resetData: resetDataForTaskUnifierSynchronization
        },
        {
            id: 'toodledo',
            label: 'Toodledo',
            img: 'resources/images/synchronization/toodledo.png',
            getAccountInfo: getToodledoAccountInfo,
            synchronize: synchronizeWithToodledo,
            resetData: resetDataForToodledoSynchronization
        }
    ];
}

export function isAutomaticSyncEnabled(settings, isPro) {
    const { automaticSynchronization, automaticSynchronizationInterval } = settings;

    if (isPro &&
        automaticSynchronization &&
        Number.isInteger(automaticSynchronizationInterval) &&
        automaticSynchronizationInterval > 0) {
        return true;
    }

    return false;
}

export function getSecondsSinceLastSync(settings, isPro) {
    const enabled = isAutomaticSyncEnabled(settings, isPro);

    if (!enabled) {
        return -1;
    }

    if (!settings.lastAutomaticSynchronization) {
        return Number.MAX_SAFE_INTEGER;
    }

    return moment().diff(moment(settings.lastAutomaticSynchronization), 'second');
}

export function getSecondsUntilNextSync(settings, isPro) {
    const seconds = getSecondsSinceLastSync(settings, isPro);

    if (seconds < 0) {
        return seconds;
    }

    return Math.max(0, (settings.automaticSynchronizationInterval * 60) - seconds);
}

export function isAutomaticSyncNeeded(settings, isPro) {
    const seconds = getSecondsSinceLastSync(settings, isPro);

    if (seconds < 0) {
        return false;
    }

    return (seconds > settings.automaticSynchronizationInterval * 60);
}