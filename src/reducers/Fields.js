const Fields = (state = [], action) => {
    switch (action.type) {
        case 'SET_FIELDS': {
            return [
                ...action.fields
            ];
        }
        case 'ADD_FIELD': {
            const fields = [
                ...state
            ];

            const index = fields.findIndex(field => field.id === action.field.id);

            if (index >= 0) {
                throw Error(`The field with id "${action.field.id}" cannot be added as it already exists`);
            }

            fields.push(action.field);

            return fields;
        }
        case 'UPDATE_FIELD': {
            const fields = [
                ...state
            ];

            const index = fields.findIndex(field => field.id === action.field.id);

            if (index < 0) {
                throw Error(`The field with id "${action.field.id}" cannot be updated as it doesn't exist`);
            }

            fields[index] = action.field;

            return fields;
        }
        case 'DELETE_FIELD': {
            const fields = [
                ...state
            ];

            const fieldIds = Array.isArray(action.fieldId) ? action.fieldId : [action.fieldId];

            return fields.filter(field => !fieldIds.includes(field.id));
        }
        default:
            return state
    }
}

export default Fields