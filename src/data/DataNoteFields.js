import { addColorsToArray } from 'utils/ColorUtils';

export function getDefaultNoteFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: 'ID',
            type: 'text',
            editable: false
        },
        {
            static: true,
            id: 'creationDate',
            title: 'Creation date',
            type: 'dateTime',
            editable: false
        },
        {
            static: true,
            id: 'updateDate',
            title: 'Update date',
            type: 'dateTime',
            editable: false
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
            id: 'star',
            title: 'Star',
            type: 'star',
            editable: true
        },
        {
            static: true,
            id: 'tags',
            title: 'Tags',
            type: 'tags',
            editable: true
        },
        {
            static: true,
            id: 'folder',
            title: 'Folder',
            type: 'folder',
            editable: true
        },
        {
            static: true,
            id: 'text',
            title: 'Text',
            type: 'textarea',
            editable: true
        }
    ]);
}