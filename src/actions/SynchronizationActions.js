export function updateToodledoData(data) {
    return dispatch => {
        dispatch({
            type: 'UPDATE_TOODLEDO_DATA',
            data
        });

        return Promise.resolve();
    };
}