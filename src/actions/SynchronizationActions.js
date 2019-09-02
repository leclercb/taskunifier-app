import { getToodledoAccountInfo } from 'actions/synchronization/toodledo/ToodledoAccountInfoActions';
import { synchronizeWithToodledo } from 'actions/synchronization/toodledo/ToodledoSynchronizationActions';
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

            if (isSynchronizing(state)) {
                return;
            }

            await dispatch(setSynchronizing(true));
            await dispatch(synchronizeWithToodledo());
        } finally {
            await dispatch(setSynchronizing(false));
        }
    };
}

export function getAccountInfo() {
    return getToodledoAccountInfo();
}