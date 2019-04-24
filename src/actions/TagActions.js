import moment from 'moment';

export const updateTag = (tag) => {
    return dispatch => {
        dispatch({
            type: 'UPDATE_TAG',
            updateDate: moment().toJSON(),
            tag: tag
        });

        return Promise.resolve();
    };
};

export const deleteTag = tagId => {
    return dispatch => {
        dispatch({
            type: 'DELETE_TAG',
            updateDate: moment().toJSON(),
            tagId: tagId
        });

        return Promise.resolve();
    };
};