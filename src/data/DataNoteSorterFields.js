import { addColorsToArray } from 'utils/ColorUtils';

export function getNoteSorterFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'field',
            title: 'Field',
            type: 'noteField',
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