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