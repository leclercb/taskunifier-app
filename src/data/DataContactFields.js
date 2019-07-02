import { addColorsToArray } from 'utils/ColorUtils';

export function getContactFields() {
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
            id: 'firstName',
            title: 'First Name',
            type: 'text',
            editable: true
        },
        {
            static: true,
            id: 'lastName',
            title: 'Last Name',
            type: 'text',
            editable: true
        },
        {
            static: true,
            id: 'email',
            title: 'Email',
            type: 'text',
            editable: true
        },
        {
            static: true,
            id: 'color',
            title: 'Color',
            type: 'color',
            editable: true
        }
    ]);
}