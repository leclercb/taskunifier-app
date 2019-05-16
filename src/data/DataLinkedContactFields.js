import { addColorsToArray } from 'utils/ColorUtils';

export function getLinkedContactFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'links',
            title: 'Links',
            type: 'linkedContactLinks',
            editable: true
        },
        {
            static: true,
            id: 'contact',
            title: 'Contact',
            type: 'contact',
            editable: true
        }
    ]);
}