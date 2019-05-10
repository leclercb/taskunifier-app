import { getCompareForType } from 'utils/FieldUtils';

export function sortObjects(objects, fields, filter, state) {
    if (!filter || !filter.sortBy) {
        return objects;
    }

    return objects.sort((a, b) => {
        for (let fieldId of filter.sortBy) {
            const field = fields.find(field => field.id === fieldId);

            if (!field) {
                continue;
            }

            const valueA = a[field.id];
            const valueB = b[field.id];

            const result = getCompareForType(field.type, valueA, valueB, state);

            if (result !== 0) {
                return result;
            }
        }

        return 0;
    });
}