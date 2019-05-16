import uuid from 'uuid';
import moment from 'moment';
import Constants from 'constants/Constants';
import { loadFromFile, saveToFile } from 'utils/ActionUtils';
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
    return dispatch => {
        const id = uuid();

        dispatch({
            type: 'ADD_OBJECT',
            property,
            generateId: () => uuid(),
            creationDate: moment().toJSON(),
            object: {
                color: Constants.defaultObjectColor,
                ...object,
                id
            }
        });

        return Promise.resolve(id);
    };
}

export function updateObject(property, object) {
    return dispatch => {
        dispatch({
            type: 'UPDATE_OBJECT',
            property,
            generateId: () => uuid(),
            updateDate: moment().toJSON(),
            object
        });

        return Promise.resolve();
    };
}

export function deleteObject(property, objectId) {
    return dispatch => {
        dispatch({
            type: 'DELETE_OBJECT',
            property,
            generateId: () => uuid(),
            updateDate: moment().toJSON(),
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