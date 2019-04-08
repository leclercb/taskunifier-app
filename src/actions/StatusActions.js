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