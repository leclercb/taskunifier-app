export const setStatusVisible = visible => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_STATUS_VISIBLE',
            visible: visible
        });

        return Promise.resolve();
    };
};

export const setSilent = silent => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SILENT',
            silent: silent
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

export const updateProcess = (processId, status = null, title = null, error = null) => {
    return (dispatch, getState) => {
        const action = {
            type: 'UPDATE_PROCESS',
            process: {
                id: processId
            }
        };

        if (status) {
            action.process.status = status;
        }

        if (title) {
            action.process.title = title;
        }

        if (error) {
            action.process.error = error;
        }

        dispatch(action);

        return Promise.resolve();
    };
};