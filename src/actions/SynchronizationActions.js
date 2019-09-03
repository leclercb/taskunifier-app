import { getTaskUnifierAccountInfo } from 'actions/synchronization/taskunifier/TaskUnifierAccountInfoActions';
import { synchronizeWithTaskUnifier } from 'actions/synchronization/taskunifier/TaskUnifierSynchronizationActions';
import { getToodledoAccountInfo } from 'actions/synchronization/toodledo/ToodledoAccountInfoActions';
import { synchronizeWithToodledo } from 'actions/synchronization/toodledo/ToodledoSynchronizationActions';
import { getSettings } from 'selectors/SettingSelectors';
import { isSynchronizing } from 'selectors/SynchronizationSelectors';

export function setSynchronizing(synchronizing) {
    return async dispatch => {
        dispatch({
            type: 'SET_SYNCHRONIZING',
            synchronizing
        });
    };
}

export function setSynchronizationData(application, data) {
    return async dispatch => {
        dispatch({
            type: 'SET_SYNCHRONIZATION_DATA',
            application,
            data
        });
    };
}

export function synchronize() {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const settings = getSettings(state);

            if (isSynchronizing(state)) {
                return;
            }

            await dispatch(setSynchronizing(true));

            switch ('toodledo') {// TODO settings.synchronizationApp) {
                case 'taskunifier':
                    await dispatch(synchronizeWithTaskUnifier());
                    break;
                case 'toodledo':
                    await dispatch(synchronizeWithToodledo());
                    break;
                default:
                    throw new Error('No synchronization application defined');
            }
        } finally {
            await dispatch(setSynchronizing(false));
        }
    };
}

export function getAccountInfo() {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        switch ('toodledo') {// TODO settings.synchronizationApp) {
            case 'taskunifier':
                await dispatch(getTaskUnifierAccountInfo());
                break;
            case 'toodledo':
                await dispatch(getToodledoAccountInfo());
                break;
            default:
                throw new Error('No synchronization application defined');
        }
    };
}