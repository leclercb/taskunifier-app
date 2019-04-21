export const updateTag = (tag) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'UPDATE_TAG',
            tag: tag
        });

        return Promise.resolve();
    };
};

export const deleteTag = tagId => {
    return (dispatch, getState) => {
        dispatch({
            type: 'DELETE_TAG',
            tagId: tagId
        });

        return Promise.resolve();
    };
};