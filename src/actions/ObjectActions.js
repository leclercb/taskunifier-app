import uuid from 'uuid';
import moment from 'moment';
import { loadFromFile, saveToFile } from 'actions/ActionUtils';
import Constants from 'constants/Constants';
import { filterByStatic } from 'utils/CategoryUtils';

export function loadObjectsFromFile(property, file) {
    return dispatch => dispatch(loadFromFile(property, file, data => dispatch(setObjects(property, data))));
}

export function saveObjectsToFile(property, file, data) {
    return saveToFile(property, file, filterByStatic(data));
}

export function setObjects(property, objects) {
    return dispatch => {
        dispatch({
            type: 'SET_OBJECTS',
            property,
            objects
        });

        return Promise.resolve();
    };
}

export function addObject(property, object) {
    return (dispatch, getState) => {
        const id = uuid();

        dispatch({
            type: 'ADD_OBJECT',
            property,
            generateId: () => uuid(),
            creationDate: moment().toISOString(),
            object: {
                color: Constants.defaultObjectColor,
                ...object,
                id
            }
        });

        const newObject = getState()[property].find(item => item.id === id);
        return Promise.resolve(newObject);
    };
}

export function updateObject(property, object) {
    return (dispatch, getState) => {
        dispatch({
            type: 'UPDATE_OBJECT',
            property,
            generateId: () => uuid(),
            updateDate: moment().toISOString(),
            object
        });

        const updatedObject = getState()[property].find(item => item.id === object.id);
        return Promise.resolve(updatedObject);
    };
}

export function deleteObject(property, objectId) {
    return dispatch => {
        dispatch({
            type: 'DELETE_OBJECT',
            property,
            generateId: () => uuid(),
            updateDate: moment().toISOString(),
            immediate: true,
            objectId
        });

        return Promise.resolve();
    };
}

export function cleanObjects(property) {
    return dispatch => {
        dispatch({
            type: 'CLEAN_OBJECTS',
            property
        });

        return Promise.resolve();
    };
}