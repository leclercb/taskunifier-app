import uuid from 'uuid';

const fs = window.require('fs');

export const loadObjectsFromFile = (property, file, onData = null) => {
    return (dispatch, getState) => {
        const processId = uuid();

        dispatch({
            type: 'UPDATE_PROCESS',
            process: {
                id: processId,
                status: 'RUNNING',
                title: `Load "${property}" from file`
            }
        });

        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {

            } else {
                dispatch({
                    type: 'UPDATE_PROCESS',
                    process: {
                        id: processId,
                        status: 'COMPLETED'
                    }
                });

                if (onData) {
                    onData(JSON.parse(data));
                } else {
                    setObjects(property, JSON.parse(data))(dispatch, getState);
                }
            }
        });
    };
};

export const saveObjectsToFile = (property, file) => {
    return (dispatch, getState) => {
        const state = getState();

        fs.writeFile(file, JSON.stringify(state[property]), err => {
            if (err) {

            }
        });
    };
};

export const setObjects = (property, objects) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_OBJECTS',
            property: property,
            objects: objects
        });
    };
};

export const addObject = (property, object) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'ADD_OBJECT',
            property: property,
            object: object
        });
    };
};

export const updateObject = (property, object) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'UPDATE_OBJECT',
            property: property,
            object: object
        });
    };
};

export const deleteObject = (property, objectId) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'DELETE_OBJECT',
            property: property,
            objectId: objectId
        });
    };
};