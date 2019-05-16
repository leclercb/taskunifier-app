import { addColorsToArray } from 'utils/ColorUtils';

export function getTaskSorterFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'field',
            title: 'Field',
            type: 'taskField',
            editable: true
        },
        {
            static: true,
            id: 'direction',
            title: 'Direction',
            type: 'sortDirection',
            editable: true
        }
    ]);
}