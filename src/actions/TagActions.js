import moment from 'moment';

export function updateTag(tag) {
    return dispatch => {
        dispatch({
            type: 'UPDATE_TAG',
            updateDate: moment().toISOString(),
            tag
        });

        return Promise.resolve();
    };
}

export function deleteTag(tagId) {
    return dispatch => {
        dispatch({
            type: 'DELETE_TAG',
            updateDate: moment().toISOString(),
            tagId
        });

        return Promise.resolve();
    };
}