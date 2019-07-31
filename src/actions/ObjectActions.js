import uuid from 'uuid';
import moment from 'moment';
import {
    loadFromFile,
    loadFromServer,
    saveToFile,
    saveToServer
} from 'actions/ActionUtils';
import Constants from 'constants/Constants';
import { getObjectById } from 'selectors/ObjectSelectors';
import { filterByStatic } from 'utils/CategoryUtils';

export function loadObjectsFromFile(property, file) {
    return async dispatch => {
        const data = await dispatch(loadFromFile(property, file));
        await dispatch(setObjects(property, data));
    };
}

export function saveObjectsToFile(property, file, data) {
    return saveToFile(property, file, filterByStatic(data));
}

export function loadObjectsFromServer(property) {
    return async dispatch => {
        const data = await dispatch(loadFromServer(property));
        await dispatch(setObjects(property, data));
    };
}

export function saveObjectToServer(property, oldObject, newObject) {
    return saveToServer(property, oldObject, newObject);
}

export function setObjects(property, objects) {
    return async dispatch => {
        await dispatch({
            type: 'SET_OBJECTS',
            property,
            objects
        });
    };
}

export function changeId(property, oldId, newId) {
    return async dispatch => {
        await dispatch({
            type: 'CHANGE_ID',
            property,
            oldId,
            newId
        });
    };
}

export function addObject(property, object, options = {}) {
    return async (dispatch, getState) => {
        const id = uuid();

        await dispatch({
            type: 'ADD_OBJECT',
            property,
            generateId: () => uuid(),
            creationDate: moment().toISOString(),
            object: {
                color: Constants.defaultObjectColor,
                ...object,
                id
            },
            options
        });

        const newObject = getObjectById(getState(), property, id);
        const createdObject = await dispatch(saveObjectToServer(property, null, newObject));
        await dispatch(changeId(property, newObject.id, createdObject.id));

        return newObject;
    };
}

export function updateObject(property, object, options = {}) {
    return async (dispatch, getState) => {
        const oldObject = getObjectById(getState(), property, object.id);

        await dispatch({
            type: 'UPDATE_OBJECT',
            property,
            generateId: () => uuid(),
            updateDate: moment().toISOString(),
            object,
            options
        });

        const newObject = getObjectById(getState(), property, object.id);
        await dispatch(saveObjectToServer(property, oldObject, newObject));

        return newObject;
    };
}

export function deleteObject(property, objectId, options = {}) {
    return async dispatch => {
        await dispatch({
            type: 'DELETE_OBJECT',
            property,
            generateId: () => uuid(),
            updateDate: moment().toISOString(),
            objectId,
            options
        });
    };
}

export function cleanObjects(property) {
    return async dispatch => {
        await dispatch({
            type: 'CLEAN_OBJECTS',
            property
        });
    };
}