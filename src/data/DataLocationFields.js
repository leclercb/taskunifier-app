import { addColorsToArray } from 'utils/ColorUtils';

export function getLocationFields() {
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
            editable: false,
            visible: false
        },
        {
            static: true,
            id: 'updateDate',
            title: 'Update date',
            type: 'dateTime',
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
            id: 'description',
            title: 'Description',
            type: 'textarea',
            editable: true
        },
        {
            static: true,
            id: 'longitude',
            title: 'Longitude',
            type: 'text',
            editable: true
        },
        {
            static: true,
            id: 'latitude',
            title: 'Latitude',
            type: 'text',
            editable: true
        }
    ]);
}