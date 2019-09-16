import uuid from 'uuid/v4';
import moment from 'moment';
import {
    loadFromFile,
    loadFromServer,
    saveToFile
} from 'actions/ActionUtils';
import { updateProcess } from 'actions/ThreadActions';
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

export function loadObjectsFromServer(property, options, params) {
    return async dispatch => {
        const data = await dispatch(loadFromServer(property, options, params));
        await dispatch(setObjects(property, data));
    };
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

export function addObject(
    property,
    object,
    options = {},
    defaultValues = {
        title: '',
        color: Constants.defaultObjectColor
    }) {
    return async (dispatch, getState) => {
        const processId = uuid();

        try {
            let id = uuid();

            await dispatch({
                type: 'ADD_OBJECT',
                property,
                generateId: () => uuid(),
                creationDate: moment().toISOString(),
                object: {
                    ...defaultValues,
                    ...object,
                    id
                },
                options
            });

            const newObject = getObjectById(getState(), property, id);

            const action = await dispatch({
                type: 'POST_ADD_OBJECT',
                property,
                object: newObject,
                options
            });

            return action.addedObject || newObject;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: `Add "${object.title}" of type "${property}"`,
                error: error.toString()
            }));
        }
    };
}

export function duplicateObject(property, object, options = {}) {
    return async dispatch => {
        const processId = uuid();

        try {
            const objects = Array.isArray(object) ? object : [object];
            const addedObjects = [];

            for (let o of objects) {
                addedObjects.push(await dispatch(addObject(property, o, options)));
            }

            if (Array.isArray(object)) {
                return addedObjects;
            } else {
                return addedObjects[0];
            }
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: `Duplicate object(s) of type "${property}"`,
                error: error.toString()
            }));
        }
    };
}

export function updateObject(property, object, options = {}) {
    return async (dispatch, getState) => {
        const processId = uuid();

        try {
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

            await dispatch({
                type: 'POST_UPDATE_OBJECT',
                property,
                oldObject,
                newObject,
                options
            });

            return newObject;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: `Update "${object.title}" of type "${property}"`,
                error: error.toString()
            }));
        }
    };
}

export function deleteObject(property, objectId, options = {}) {
    return async dispatch => {
        const processId = uuid();

        try {
            await dispatch({
                type: 'DELETE_OBJECT',
                property,
                generateId: () => uuid(),
                updateDate: moment().toISOString(),
                objectId,
                options
            });

            await dispatch({
                type: 'POST_DELETE_OBJECT',
                property,
                objectId,
                options
            });
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: `Remove object(s) of type "${property}"`,
                error: error.toString()
            }));
        }
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