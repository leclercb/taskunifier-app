import uuid from 'uuid';
import { updateProcess } from './StatusActions';

const fs = window.require('fs');

export const loadObjectsFromFile = (property, file, onData = null) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            updateProcess(processId, 'RUNNING', `Load "${property}" from file`)(dispatch, getState);

            fs.readFile(file, 'utf-8', (err, data) => {
                if (err) {
                    updateProcess(processId, 'ERROR', null, err)(dispatch, getState);
                    reject();
                } else {
                    updateProcess(processId, 'COMPLETED')(dispatch, getState);

                    if (onData) {
                        onData(JSON.parse(data)).then(() => resolve());
                    } else {
                        setObjects(property, JSON.parse(data))(dispatch, getState).then(() => resolve());
                    }
                }
            });
        });
    };
};

export const saveObjectsToFile = (property, file, data) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            updateProcess(processId, 'RUNNING', `Save "${property}" to file`)(dispatch, getState);

            fs.writeFile(file, JSON.stringify(data, null, 4), err => {
                if (err) {
                    updateProcess(processId, 'ERROR', null, err)(dispatch, getState);
                    reject();
                } else {
                    updateProcess(processId, 'COMPLETED')(dispatch, getState);
                    resolve();
                }
            });
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

        return Promise.resolve();
    };
};

export const addObject = (property, object) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'ADD_OBJECT',
            property: property,
            object: object
        });

        return Promise.resolve();
    };
};

export const updateObject = (property, object) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'UPDATE_OBJECT',
            property: property,
            object: object
        });

        return Promise.resolve();
    };
};

export const deleteObject = (property, objectId) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'DELETE_OBJECT',
            property: property,
            objectId: objectId
        });

        return Promise.resolve();
    };
};