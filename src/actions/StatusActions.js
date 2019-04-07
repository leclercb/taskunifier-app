export const setStatusVisible = visible => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_STATUS_VISIBLE',
            visible: visible
        });
    };
};