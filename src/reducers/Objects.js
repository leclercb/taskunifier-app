import { findChildren, findParents } from 'utils/HierarchyUtils';
import { clone, removePrivateKeys } from 'utils/ObjectUtils';

const Objects = property => (state = [], action) => {
    if (action.property !== property) {
        return state;
    }

    switch (action.type) {
        case 'SET_OBJECTS': {
            return [...(action.objects || [])];
        }
        case 'CHANGE_ID': {
            return changeId(state, action);
        }
        case 'ADD_OBJECT': {
            return addObject(state, action);
        }
        case 'UPDATE_OBJECT': {
            return updateObject(state, action);
        }
        case 'DELETE_OBJECT': {
            const objectIds = Array.isArray(action.objectId) ? action.objectId : [action.objectId];
            const objects = state.filter(object => objectIds.includes(object.id));
            const objectIdsWithChildren = [...objectIds];

            objects.forEach(object => {
                const children = findChildren(object, state);
                objectIdsWithChildren.push(...children.map(child => child.id));
            });

            return state.map(object => {
                if (object.state === 'LOADED' || object.state === 'TO_UPDATE') {
                    if (objectIdsWithChildren.includes(object.id)) {
                        object = { ...object };
                        object.updateDate = action.updateDate;
                        object.state = action.options.force === true ? 'DELETED' : 'TO_DELETE';
                    }

                    return object;
                }

                if (object.state === 'TO_DELETE') {
                    if (objectIdsWithChildren.includes(object.id)) {
                        object = { ...object };
                        object.state = 'DELETED';
                    }

                    return object;
                }

                return object;
            });
        }
        case 'CLEAN_OBJECTS': {
            return state.filter(object => {
                if (object.state === 'DELETED') {
                    return false;
                }

                if (object.state === 'TO_DELETE' && Object.keys(object.refIds).length === 0) {
                    return false;
                }

                return true;
            });
        }
        default:
            return state;
    }
};

const changeId = (state, action) => {
    let newState = [...state];

    const index = newState.findIndex(object => object.id === action.oldId);

    if (index < 0) {
        throw Error(`The object with id "${action.oldId}" doesn't exist`);
    }

    if (newState.findIndex(object => object.id === action.newId) >= 0) {
        throw Error(`An object with id "${action.newId}" already exists`);
    }

    const oldObject = newState[index];

    const updatedObject = {
        ...oldObject,
        id: action.newId
    };

    newState[index] = updatedObject;

    return newState;
};

const addObject = (state, action) => {
    const newState = [...state];

    if (!action.object.id) {
        throw Error('The object doesn\'t have an ID');
    }

    const index = newState.findIndex(object => object.id === action.object.id);

    if (index >= 0) {
        throw Error(`The object with id "${action.object.id}" cannot be added as it already exists`);
    }

    const newObject = {
        ...clone(action.object),
        creationDate: action.creationDate,
        updateDate: action.creationDate,
        state: 'LOADED'
    };

    if (action.options.keepRefIds !== true) {
        newObject.refIds = {};
    }

    removePrivateKeys(newObject);

    const parents = findParents(newObject, newState);

    if (newObject.id === newObject.parent || parents.find(parent => parent.id === newObject.id)) {
        throw Error('The parent cannot become a child of himself');
    }

    for (let i = 0; i < parents.length; i++) {
        if (parents[i].state !== 'LOADED' && parents[i].state !== 'TO_UPDATE') {
            throw Error('The parent object cannot be used as it is not in a valid state');
        }
    }

    newState.push(newObject);

    return newState;
};

const updateObject = (state, action) => {
    let newState = [...state];

    if (!action.object.id) {
        throw Error('The object doesn\'t have an ID');
    }

    const index = newState.findIndex(object => object.id === action.object.id);

    if (index < 0) {
        throw Error(`The object with id "${action.object.id}" cannot be updated as it doesn't exist`);
    }

    const oldObject = newState[index];

    if (oldObject.state !== 'LOADED' && oldObject.state !== 'TO_UPDATE') {
        throw Error('The object cannot be updated as it is not in a valid state');
    }

    const updatedObject = {
        ...action.object,
        creationDate: oldObject.creationDate,
        updateDate: action.updateDate,
        state: action.options.loaded === true ? 'LOADED' : 'TO_UPDATE'
    };

    removePrivateKeys(updatedObject);

    const parents = findParents(updatedObject, newState);

    if (updatedObject.id === updatedObject.parent || parents.find(parent => parent.id === updatedObject.id)) {
        throw Error('The parent cannot become a child of himself');
    }

    for (let i = 0; i < parents.length; i++) {
        if (parents[i].state !== 'LOADED' && parents[i].state !== 'TO_UPDATE') {
            throw Error('The parent object cannot be used as it is not in a valid state');
        }
    }

    newState[index] = updatedObject;

    return newState;
};

export default Objects;