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

export const updateProcess = process => {
    return (dispatch, getState) => {
        const action = {
            type: 'UPDATE_PROCESS',
            process: process
        };

        dispatch(action);

        return Promise.resolve();
    };
};