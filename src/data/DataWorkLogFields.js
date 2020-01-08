import { addColorsToArray } from 'utils/ColorUtils';

export function getWorkLogFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'start',
            title: 'Start',
            type: 'dateTime',
            editable: true
        },
        {
            static: true,
            id: 'end',
            title: 'End',
            type: 'dateTime',
            editable: true
        },
        {
            static: true,
            id: 'length',
            title: 'Length',
            type: 'length',
            editable: false
        }
    ]);
}