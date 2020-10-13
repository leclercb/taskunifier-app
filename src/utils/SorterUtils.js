import { compareObjectsHierarchy } from 'utils/CompareUtils';

export function sortObjects(objects, fields, sorters, state, getMetaDataFunction, indented) {
    if (!sorters) {
        sorters = [];
    }

    return objects.sort((a, b) => {
        let result = 0;

        for (let sorter of sorters) {
            const field = fields.find(field => field.id === sorter.field);
            const sortDirection = sorter.direction;

            if (!field || !sortDirection) {
                continue;
            }

            result = compareObjectsHierarchy(field, a, b, sortDirection, state, getMetaDataFunction, indented);

            if (result !== 0) {
                break;
            }
        }

        if (result === 0) {
            result = compareObjectsHierarchy(fields.find(field => field.id === 'title'), a, b, 'ascending', state, getMetaDataFunction, indented);
        }

        if (result === 0) {
            result = compareObjectsHierarchy(fields.find(field => field.id === 'id'), a, b, 'ascending', state, getMetaDataFunction, indented);
        }

        return result;
    });
}