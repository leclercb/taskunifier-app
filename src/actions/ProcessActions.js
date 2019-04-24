import uuid from 'uuid';

export const setProcessesVisible = visible => {
    return dispatch => {
        dispatch({
            type: 'SET_PROCESSES_VISIBLE',
            visible: visible
        });

        return Promise.resolve();
    };
};

export const clearProcesses = () => {
    return dispatch => {
        dispatch({
            type: 'CLEAR_PROCESSES'
        });

        return Promise.resolve();
    };
};

export const updateProcess = process => {
    return dispatch => {
        const action = {
            type: 'UPDATE_PROCESS',
            process: process,
            generateNotificationId: () => uuid()
        };

        dispatch(action);

        return Promise.resolve();
    };
};

export const deleteNotification = notificationId => {
    return dispatch => {
        dispatch({
            type: 'DELETE_NOTIFICATION',
            notificationId: notificationId
        });

        return Promise.resolve();
    };
};