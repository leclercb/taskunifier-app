import moment from 'moment';

export function updateTag(tag) {
    return async dispatch => {
        dispatch({
            type: 'UPDATE_TAG',
            updateDate: moment().toISOString(),
            tag
        });
    };
}

export function deleteTag(tagId) {
    return async dispatch => {
        dispatch({
            type: 'DELETE_TAG',
            updateDate: moment().toISOString(),
            tagId
        });
    };
}