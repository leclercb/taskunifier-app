const Objects = (property, onUpdate = (object, oldObject) => { }) => (state = [], action) => {
    if (property !== action.property) {
        return state;
    }

    switch (action.type) {
        case 'SET_OBJECTS': {
            return (action.objects || []);
        }
        case 'ADD_OBJECT': {
            const objects = [
                ...state
            ];

            if (!action.object.id) {
                throw Error('The object doesn\'t have an ID');
            }

            const index = objects.findIndex(object => object.id === action.object.id);

            if (index >= 0) {
                throw Error(`The object with id "${action.object.id}" cannot be added as it already exists`);
            }

            const newObject = {
                title: 'Untitled',
                color: null,
                ...action.object,
                refIds: {},
                creationDate: action.creationDate,
                updateDate: action.creationDate,
                state: 'LOADED'
            };

            objects.push(newObject);

            onUpdate(newObject, null);

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

            const oldObject = objects[index];

            if (oldObject.state !== 'LOADED' && oldObject.state !== 'TO_UPDATE') {
                throw Error('The object cannot be updated as it is not in a valid state');
            }

            objects[index] = {
                ...action.object,
                creationDate: objects[index].creationDate,
                updateDate: action.updateDate,
                state: 'TO_UPDATE'
            };

            onUpdate(objects[index], oldObject);

            return objects;
        }
        case 'UPDATE_HIERARCHY': {
            const objects = [
                ...state
            ];

            if (!action.targetObject.id) {
                throw Error('The target object doesn\'t have an ID');
            }

            if (!action.sourceObject.id) {
                throw Error('The source object doesn\'t have an ID');
            }

            const targetIndex = objects.findIndex(object => object.id === action.targetObject.id);
            const sourceIndex = objects.findIndex(object => object.id === action.sourceObject.id);

            if (targetIndex < 0) {
                throw Error(`The target object with id "${action.targetObject.id}" cannot be updated as it doesn't exist`);
            }

            if (sourceIndex < 0) {
                throw Error(`The source object with id "${action.sourceObject.id}" cannot be updated as it doesn't exist`);
            }

            // TODO update objects reducer to handle children
        }
        case 'DELETE_OBJECT': {
            const objectIds = Array.isArray(action.objectId) ? action.objectId : [action.objectId];

            return state.map(object => {
                if (object.state === 'LOADED' || object.state === 'TO_UPDATE') {
                    if (objectIds.includes(object.id)) {
                        object = { ...object };
                        object.updateDate = action.updateDate;
                        object.state = action.immediate === true ? 'DELETED' : 'TO_DELETE';
                    }
                }

                return object;
            });
        }
        case 'CLEAN_OBJECTS': {
            const objects = [
                ...state
            ];

            return objects.filter(object => object.state !== 'DELETED');
        }
        default:
            return state;
    }
};

export default Objects;