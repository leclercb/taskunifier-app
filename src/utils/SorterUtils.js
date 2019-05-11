import { getCompareForType } from 'utils/FieldUtils';

export function sortObjects(objects, fields, filter, state) {
    if (!filter || !filter.sorters) {
        return objects;
    }

    return objects.sort((a, b) => {
        for (let sorter of filter.sorters) {
            const field = fields.find(field => field.id === sorter.field);
            const sortDirection = sorter.direction;

            if (!field || !sortDirection) {
                continue;
            }

            const valueA = a[field.id];
            const valueB = b[field.id];

            let result = getCompareForType(field.type, valueA, valueB, state);

            if (sortDirection === 'descending') {
                result *= -1;
            }

            if (result !== 0) {
                return result;
            }
        }

        return 0;
    });
}