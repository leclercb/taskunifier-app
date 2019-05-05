import moment from 'moment';

export const updateTag = tag => {
    return (dispatch, getState) => {
        dispatch({
            type: 'UPDATE_TAG',
            updateDate: moment().toJSON(),
            tag: tag,
            ...getExtraProps(getState())
        });

        return Promise.resolve();
    };
};

export const deleteTag = tagId => {
    return (dispatch, getState) => {
        dispatch({
            type: 'DELETE_TAG',
            updateDate: moment().toJSON(),
            tagId: tagId,
            ...getExtraProps(getState())
        });

        return Promise.resolve();
    };
};

const getExtraProps = state => {
    return {
        settings: state.settings,
        noteFields: state.noteFields,
        taskFields: state.taskFields
    };
};