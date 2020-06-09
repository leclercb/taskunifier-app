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

export function runProcess(fn = null, title = 'User action') {
    return async dispatch => {
        const processId = uuid();

        try {
            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title
            }));

            let promises = Array.isArray(fn) ? fn : [fn];

            let result = await Promise.all(promises);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return Array.isArray(fn) ? result : result[0];
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
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