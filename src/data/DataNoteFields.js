import { addColorsToArray } from 'utils/ColorUtils';

export function getDefaultNoteFields(settings) {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: 'ID',
            type: 'text',
            editable: false,
            defaultOrder: 1
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
            defaultOrder: 2
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
            defaultOrder: 3
        },
        {
            static: true,
            id: 'title',
            title: 'Title',
            type: 'text',
            editable: true,
            defaultOrder: 5
        },
        {
            static: true,
            id: 'star',
            title: 'Star',
            type: 'star',
            editable: true,
            defaultOrder: 4
        },
        {
            static: true,
            id: 'tags',
            title: 'Tags',
            type: 'tags',
            editable: true,
            defaultOrder: 6
        },
        {
            static: true,
            id: 'folder',
            title: 'Folder',
            type: 'folder',
            editable: true,
            defaultOrder: 7
        },
        {
            static: true,
            id: 'text',
            title: 'Text',
            type: 'richtext',
            editable: true,
            defaultOrder: 8
        }
    ]);
}