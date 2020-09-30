import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
    loadFromFile,
    loadFromServer,
    saveToFile
} from 'actions/ActionUtils';
import { updateProcess } from 'actions/ThreadActions';
import Constants from 'constants/Constants';
import { getObjectsByIds } from 'selectors/ObjectSelectors';
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

        const objects = Array.isArray(object) ? object : [object];
        const newIds = [];
        let newObjects;

        try {
            await dispatch({
                type: 'ADD_OBJECTS',
                property,
                generateId: () => uuid(),
                creationDate: moment().toISOString(),
                objects: objects.map(object => {
                    const id = uuid();

                    newIds.push(id);

                    return {
                        ...defaultValues,
                        ...object,
                        id
                    };
                }),
                options
            });

            newObjects = getObjectsByIds(getState(), property, newIds);
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: objects.length === 1 ? `Add "${object && object.title ? object.title : ''}" of type "${property}"` : `Add ${objects.length} objects of type "${property}"`,
                error: error.toString()
            }));

            throw error;
        }

        const action = await dispatch({
            type: 'POST_ADD_OBJECTS',
            property,
            objects: newObjects,
            options
        });

        const result = action.addedObjects || newObjects;

        return Array.isArray(object) ? result : result[0];
    };
}

export function duplicateObject(property, object, options = {}) {
    return async dispatch => {
        return await dispatch(addObject(property, object, options));
    };
}

export function updateObject(property, object, options = {}) {
    return async (dispatch, getState) => {
        const processId = uuid();

        const objects = Array.isArray(object) ? object : [object];
        let oldObjects;
        let newObjects;

        try {
            oldObjects = getObjectsByIds(getState(), property, objects.map(object => object.id));

            await dispatch({
                type: 'UPDATE_OBJECTS',
                property,
                generateId: () => uuid(),
                updateDate: moment().toISOString(),
                objects,
                options
            });

            newObjects = getObjectsByIds(getState(), property, objects.map(object => object.id));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: objects.length === 1 ? `Update "${object.title}" of type "${property}"` : `Update ${objects.length} objects of type "${property}"`,
                error: error.toString()
            }));

            throw error;
        }

        await dispatch({
            type: 'POST_UPDATE_OBJECTS',
            property,
            objects: objects.map((_, index) => ({
                old: oldObjects[index],
                new: newObjects[index]
            })),
            options
        });

        return Array.isArray(object) ? newObjects : newObjects[0];
    };
}

export function deleteObject(property, objectId, options = {}) {
    return async dispatch => {
        const processId = uuid();

        const objectIds = Array.isArray(objectId) ? objectId : [objectId];

        try {
            await dispatch({
                type: 'DELETE_OBJECTS',
                property,
                generateId: () => uuid(),
                updateDate: moment().toISOString(),
                objectIds,
                options
            });
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: objectIds.length === 1 ? `Remove object of type "${property}"` : `Remove ${objectIds.length} objects of type "${property}"`,
                error: error.toString()
            }));

            throw error;
        }

        await dispatch({
            type: 'POST_DELETE_OBJECTS',
            property,
            objectIds,
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