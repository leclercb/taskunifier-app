import { addColorsToArray } from 'utils/ColorUtils';

export function getGoalFields(settings) {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: 'ID',
            type: 'text',
            editable: false,
            visible: false
        },
        {
            static: true,
            id: 'creationDate',
            title: 'Creation date',
            type: 'dateTime',
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
            editable: false,
            visible: false
        },
        {
            static: true,
            id: 'updateDate',
            title: 'Update date',
            type: 'dateTime',
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
            editable: false,
            visible: false
        },
        {
            static: true,
            id: 'title',
            title: 'Title',
            type: 'text',
            editable: true
        },
        {
            static: true,
            id: 'color',
            title: 'Color',
            type: 'color',
            editable: true
        },
        {
            static: true,
            id: 'level',
            title: 'Level',
            type: 'goalLevel',
            editable: true
        },
        {
            static: true,
            id: 'contributesTo',
            title: 'Contributes To',
            type: 'goalContributesTo',
            editable: true
        },
        {
            static: true,
            id: 'archived',
            title: 'Archived',
            type: 'boolean',
            editable: true
        }
    ]);
}