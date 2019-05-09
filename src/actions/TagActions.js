import moment from 'moment';

export function updateTag(tag) {
    return dispatch => {
        dispatch({
            type: 'UPDATE_TAG',
            updateDate: moment().toJSON(),
            tag: tag
        });

        return Promise.resolve();
    };
}

export function deleteTag(tagId) {
    return dispatch => {
        dispatch({
            type: 'DELETE_TAG',
            updateDate: moment().toJSON(),
            tagId: tagId
        });

        return Promise.resolve();
    };
}