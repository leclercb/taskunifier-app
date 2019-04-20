const Objects = (property, onUpdate = (object, oldObject) => { }) => (state = [], action) => {
    if (property !== action.property) {
        return state;
    }

    switch (action.type) {
        case 'SET_OBJECTS': {
            return action.objects;
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

            objects[index] = {
                ...action.object,
                creationDate: objects[index].creationDate,
                updateDate: action.updateDate,
                state: 'TO_UPDATE'
            };

            onUpdate(objects[index], oldObject);

            return objects;
        }
        case 'DELETE_OBJECT': {
            const objects = [
                ...state
            ];

            const objectIds = Array.isArray(action.objectId) ? action.objectId : [action.objectId];

            objects.forEach(object => {
                if (objectIds.includes(object.id)) {
                    object.state = action.immediate === true ? 'DELETED' : 'TO_DELETE';
                }
            });

            return objects;
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
}

export default Objects;