import uuid from 'uuid';

export function setThreadManagerVisible(visible) {
    return dispatch => {
        dispatch({
            type: 'SET_THREAD_MANAGER_VISIBLE',
            visible: visible
        });

        return Promise.resolve();
    };
}

export function clearProcesses() {
    return dispatch => {
        dispatch({
            type: 'CLEAR_PROCESSES'
        });

        return Promise.resolve();
    };
}

export function updateProcess(process) {
    return dispatch => {
        dispatch({
            type: 'UPDATE_PROCESS',
            process: process,
            generateNotificationId: () => uuid()
        });

        return Promise.resolve();
    };
}

export function deleteNotification(notificationId) {
    return dispatch => {
        dispatch({
            type: 'DELETE_NOTIFICATION',
            notificationId: notificationId
        });

        return Promise.resolve();
    };
}