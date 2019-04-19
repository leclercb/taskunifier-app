import uuid from 'uuid';

export const setProcessesVisible = visible => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_PROCESSES_VISIBLE',
            visible: visible
        });

        return Promise.resolve();
    };
};

export const clearProcesses = () => {
    return (dispatch, getState) => {
        dispatch({
            type: 'CLEAR_PROCESSES'
        });

        return Promise.resolve();
    };
};

export const updateProcess = process => {
    return (dispatch, getState) => {
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
    return (dispatch, getState) => {
        dispatch({
            type: 'DELETE_NOTIFICATION',
            notificationId: notificationId
        });

        return Promise.resolve();
    };
};