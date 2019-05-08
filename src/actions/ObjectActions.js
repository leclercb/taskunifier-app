import uuid from 'uuid';
import moment from 'moment';
import Constants from 'constants/Constants';
import { loadFromFile, saveToFile } from 'utils/ActionUtils';
import { filterByStatic } from 'utils/CategoryUtils';

export const loadObjectsFromFile = (property, file) => {
    return dispatch => dispatch(loadFromFile(property, file, data => dispatch(setObjects(property, data))));
};

export const saveObjectsToFile = (property, file, data) => {
    return saveToFile(property, file, filterByStatic(data));
};

export const setObjects = (property, objects) => {
    return dispatch => {
        dispatch({
            type: 'SET_OBJECTS',
            property: property,
            objects: objects
        });

        return Promise.resolve();
    };
};

export const addObject = (property, object) => {
    return dispatch => {
        const id = uuid();

        dispatch({
            type: 'ADD_OBJECT',
            property: property,
            generateId: () => uuid(),
            creationDate: moment().toJSON(),
            object: {
                color: Constants.defaultObjectColor,
                ...object,
                id: id
            }
        });

        return Promise.resolve(id);
    };
};

export const updateObject = (property, object) => {
    return dispatch => {
        dispatch({
            type: 'UPDATE_OBJECT',
            property: property,
            generateId: () => uuid(),
            updateDate: moment().toJSON(),
            object: object
        });

        return Promise.resolve();
    };
};

export const deleteObject = (property, objectId) => {
    return dispatch => {
        dispatch({
            type: 'DELETE_OBJECT',
            property: property,
            generateId: () => uuid(),
            updateDate: moment().toJSON(),
            immediate: true,
            objectId: objectId
        });

        return Promise.resolve();
    };
};

export const cleanObjects = property => {
    return dispatch => {
        dispatch({
            type: 'CLEAN_OBJECTS',
            property: property
        });

        return Promise.resolve();
    };
};