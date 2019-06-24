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
    return async dispatch => {
        dispatch({
            type: 'SET_OBJECTS',
            property,
            objects
        });
    };
}

export function addObject(property, object) {
    return async (dispatch, getState) => {
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

        return getState()[property].find(item => item.id === id);
    };
}

export function updateObject(property, object) {
    return async (dispatch, getState) => {
        dispatch({
            type: 'UPDATE_OBJECT',
            property,
            generateId: () => uuid(),
            updateDate: moment().toISOString(),
            object
        });

        return getState()[property].find(item => item.id === object.id);
    };
}

export function deleteObject(property, objectId) {
    return async dispatch => {
        dispatch({
            type: 'DELETE_OBJECT',
            property,
            generateId: () => uuid(),
            updateDate: moment().toISOString(),
            immediate: true,
            objectId
        });
    };
}

export function cleanObjects(property) {
    return async dispatch => {
        dispatch({
            type: 'CLEAN_OBJECTS',
            property
        });
    };
}