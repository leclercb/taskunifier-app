import uuid from 'uuid';
import moment from 'moment';
import Constants from 'constants/Constants';
import { loadFromFile, saveToFile } from 'utils/ActionUtils';
import { filterStaticObjects } from 'utils/CategoryUtils';

export const loadObjectsFromFile = (property, file, extraProps) => {
    return dispatch => {
        return dispatch(loadFromFile(property, file, data => dispatch(setObjects(property, data, extraProps))));
    };
};

export const saveObjectsToFile = (property, file, data) => {
    return saveToFile(property, file, filterStaticObjects(data));
};

export const setObjects = (property, objects, extraProps) => {
    return dispatch => {
        dispatch({
            type: 'SET_OBJECTS',
            property: property,
            objects: objects,
            ...extraProps
        });

        return Promise.resolve();
    };
};

export const addObject = (property, object, extraProps) => {
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
            },
            ...extraProps
        });

        return Promise.resolve(id);
    };
};

export const updateObject = (property, object, extraProps) => {
    return dispatch => {
        dispatch({
            type: 'UPDATE_OBJECT',
            property: property,
            generateId: () => uuid(),
            updateDate: moment().toJSON(),
            object: object,
            ...extraProps
        });

        return Promise.resolve();
    };
};

export const deleteObject = (property, objectId, extraProps) => {
    return dispatch => {
        dispatch({
            type: 'DELETE_OBJECT',
            property: property,
            generateId: () => uuid(),
            updateDate: moment().toJSON(),
            immediate: true,
            objectId: objectId,
            ...extraProps
        });

        return Promise.resolve();
    };
};

export const cleanObjects = (property, extraProps) => {
    return dispatch => {
        dispatch({
            type: 'CLEAN_OBJECTS',
            property: property,
            ...extraProps
        });

        return Promise.resolve();
    };
};