export const setFields = () => {
    return dispatch => {
        dispatch({
            type: 'ON_SUCCESS',
            context: 'FIELDS',
            id: 'a'
        });

        dispatch({
            type: 'SET_FIELDS',
            fields: [
                {
                    id: 'field-title',
                    path: 'title',
                    title: 'Title',
                    type: 'text',
                    base: true
                },
                {
                    id: 'field-completed',
                    path: 'completed',
                    title: 'Completed',
                    type: 'checkbox',
                    base: true
                }
            ]
        });
    };
};

export const addField = field => {
    return dispatch => {
        dispatch({
            type: 'ADD_FIELD',
            field: field
        });
    };
};

export const updateField = field => {
    return dispatch => {
        dispatch({
            type: 'UPDATE_FIELD',
            field: field
        });
    };
};

export const deleteField = fieldId => {
    return dispatch => {
        dispatch({
            type: 'DELETE_FIELD',
            fieldId: fieldId
        });
    };
};