import uuid from 'uuid';
import moment from 'moment';
import { filterStaticObjects } from '../utils/CategoryUtils';
import { loadFromFile, saveToFile } from '../utils/ActionUtils';
import Constants from '../constants/Constants';

export const loadObjectsFromFile = (property, file) => {
    return (dispatch, getState) => {
        return dispatch(loadFromFile(property, file, data => dispatch(setObjects(property, data))));
    };
}; 

export const saveObjectsToFile = (property, file, data) => {
    return saveToFile(property, file, filterStaticObjects(data));
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
        const id = uuid();

        dispatch({
            type: 'ADD_OBJECT',
            property: property,
            creationDate: moment().toString(),
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
    return (dispatch, getState) => {
        dispatch({
            type: 'UPDATE_OBJECT',
            property: property,
            updateDate: moment().toString(),
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
            immediate: true,
            objectId: objectId
        });

        return Promise.resolve();
    };
};

export const cleanObjects = (property) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'CLEAN_OBJECTS',
            property: property
        });

        return Promise.resolve();
    };
};