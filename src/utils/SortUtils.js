import { getSortForType } from 'utils/FieldUtils';

export const sortObjects = (filter, fields, a, b) => {
    if (!filter || !filter.sortBy) {
        return 0;
    }

    // TODO implement
    for (let fieldId of filter.sortBy) {
        const field = fields.find(field => field.id === fieldId);

        if (!field) {
            continue;
        }

        const valueA = a[field.id];
        const valueB = b[field.id];

        const result = getSortForType(field.type, valueA, valueB);

        if (result !== 0) {
            return result;
        }
    }

    return 0;
};