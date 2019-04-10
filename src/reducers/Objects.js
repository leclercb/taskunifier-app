import uuid from 'uuid';
import Constants from '../components/constants/Constants';

export function filterObjects(objects) {
    return objects.filter(object => object.status === 'LOADED' || object.status === 'TO_UPDATE');
}

const Objects = property => (state = [], action) => {
    if (property !== action.property) {
        return state;
    }

    switch (action.type) {
        case 'SET_OBJECTS': {
            return (action.objects || []).map(object => ({
                id: uuid(),
                refIds: {},
                properties: {},
                creationDate: Date.now(),
                updateDate: Date.now(),
                status: 'LOADED',
                title: 'Untitled',
                color: Constants.defaultObjectColor,
                ...object,
            }));
        }
        case 'ADD_OBJECT': {
            const objects = [
                ...state
            ];

            objects.push({
                refIds: {},
                properties: {},
                title: 'Untitled',
                color: Constants.defaultObjectColor,
                ...action.object,
                id: uuid(),
                creationDate: Date.now(),
                updateDate: Date.now(),
                status: 'LOADED'
            });

            return objects;
        }
        case 'UPDATE_OBJECT': {
            const objects = [
                ...state
            ];

            if (!action.object.id) {
                throw Error('The object doesn\'t have an ID');
            }

            const index = objects.findIndex(object => object.id === action.object.id);

            if (index < 0) {
                throw Error(`The object with id "${action.object.id}" cannot be updated as it doesn't exist`);
            }

            objects[index] = {
                ...action.object,
                updateDate: Date.now(),
                status: 'TO_UPDATE',
            };

            return objects;
        }
        case 'DELETE_OBJECT': {
            const objects = [
                ...state
            ];

            const objectIds = Array.isArray(action.objectId) ? action.objectId : [action.objectId];

            objects.forEach(object => {
                if (objectIds.includes(object.id)) {
                    object.status = 'TO_DELETE';
                }
            });

            return objects;
        }
        case 'CLEAN_OBJECTS': {
            const objects = [
                ...state
            ];

            return objects.filter(object => object.status !== 'DELETED');
        }
        default:
            return state
    }
}

export default Objects