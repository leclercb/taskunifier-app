import { v4 as uuid } from 'uuid';
import { isBusy } from 'selectors/ThreadSelectors';

export function checkIsBusy(fn = null, silent = false) {
    return async (dispatch, getState) => {
        const state = getState();

        if (isBusy(state)) {
            if (!silent) {
                throw Error('Another process is currently running');
            }

            return;
        }

        if (fn) {
            return fn();
        }
    };
}

export function setThreadManagerVisible(visible) {
    return async dispatch => {
        dispatch({
            type: 'SET_THREAD_MANAGER_VISIBLE',
            visible
        });
    };
}

export function clearProcesses() {
    return async dispatch => {
        dispatch({
            type: 'CLEAR_PROCESSES'
        });
    };
}

export function updateProcess(process) {
    return async dispatch => {
        dispatch({
            type: 'UPDATE_PROCESS',
            process,
            generateNotificationId: () => uuid()
        });
    };
}

export function deleteNotification(notificationId) {
    return async dispatch => {
        dispatch({
            type: 'DELETE_NOTIFICATION',
            notificationId
        });
    };
}