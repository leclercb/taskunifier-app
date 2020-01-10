import { addColorsToArray } from 'utils/ColorUtils';

export function getWorkLogFields(settings) {
    return addColorsToArray([
        {
            static: true,
            id: 'start',
            title: 'Start',
            type: 'dateTime',
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
            editable: true
        },
        {
            static: true,
            id: 'end',
            title: 'End',
            type: 'dateTime',
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
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