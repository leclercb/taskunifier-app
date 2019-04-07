const Objects = property => (state = [], action) => {
    if (property !== action.property) {
        return state;
    }

    switch (action.type) {
        case 'SET_OBJECTS': {
            return [
                ...action.objects
            ];
        }
        case 'ADD_OBJECT': {
            const objects = [
                ...state
            ];

            const index = objects.findIndex(object => object.id === action.object.id);

            if (index >= 0) {
                throw Error(`The object with id "${action.object.id}" cannot be added as it already exists`);
            }

            objects.push(action.object);

            return objects;
        }
        case 'UPDATE_OBJECT': {
            const objects = [
                ...state
            ];

            const index = objects.findIndex(object => object.id === action.object.id);

            if (index < 0) {
                throw Error(`The object with id "${action.object.id}" cannot be updated as it doesn't exist`);
            }

            objects[index] = action.object;

            return objects;
        }
        case 'DELETE_OBJECT': {
            const objects = [
                ...state
            ];

            const objectIds = Array.isArray(action.objectId) ? action.objectId : [action.objectId];

            return objects.filter(object => !objectIds.includes(object.id));
        }
        default:
            return state
    }
}

export default Objects