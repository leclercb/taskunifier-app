import uuid from 'uuid/v4';
import { isBusy } from 'selectors/ThreadSelectors';

export function checkIsBusy() {
    return async (dispatch, getState) => {
        const state = getState();

        if (isBusy(state)) {
            // TODO throw Error('Another process is currently running');
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