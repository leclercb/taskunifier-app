import { findChildren, findParents } from 'utils/HierarchyUtils';
import { removePrivateKeys, clone } from 'utils/ObjectUtils';

const Objects = (property, onUpdate = null) => (state = [], action) => {
    if (action.property !== property) {
        return state;
    }

    switch (action.type) {
        case 'SET_OBJECTS': {
            return [...(action.objects || [])];
        }
        case 'ADD_OBJECT': {
            return addObject(state, action);
        }
        case 'UPDATE_OBJECT': {
            return updateObject(state, action, onUpdate);
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
                        object.state = action.immediate === true ? 'DELETED' : 'TO_DELETE';
                    }
                }

                return object;
            });
        }
        case 'CLEAN_OBJECTS': {
            return state.filter(object => object.state !== 'DELETED');
        }
        default:
            return state;
    }
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
        title: 'Untitled',
        color: null,
        ...clone(action.object),
        refIds: {},
        creationDate: action.creationDate,
        updateDate: action.creationDate,
        state: 'LOADED'
    };

    removePrivateKeys(newObject);

    newState.push(newObject);

    return newState;
};

const updateObject = (state, action, onUpdate) => {
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
        creationDate: newState[index].creationDate,
        updateDate: action.updateDate,
        state: 'TO_UPDATE'
    };

    removePrivateKeys(updatedObject);

    const parents = findParents(updatedObject, newState);

    if (parents.find(parent => parent.id === updatedObject.id)) {
        throw Error('The parent cannot become a child of himself');
    }

    for (let i = 0; i < parents.length; i++) {
        if (parents[i].state !== 'LOADED' && parents[i].state !== 'TO_UPDATE') {
            throw Error('The parent object cannot be used as it is not in a valid state');
        }
    }

    newState[index] = updatedObject;

    const addedObjects = onUpdate ? onUpdate(newState[index], oldObject, action.updateDate) : null;

    if (addedObjects) {
        addedObjects.forEach(addedObject => {
            addedObject.id = action.generateId();

            newState = addObject(
                newState,
                {
                    object: addedObject,
                    creationDate: action.updateDate
                });
        });
    }

    return newState;
};

export default Objects;