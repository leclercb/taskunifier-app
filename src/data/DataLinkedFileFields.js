import { addColorsToArray } from 'utils/ColorUtils';

export function getLinkedFileFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'links',
            title: 'Links',
            type: 'linkedFileLinks',
            editable: true
        },
        {
            static: true,
            id: 'file',
            title: 'File',
            type: 'file',
            editable: true
        }
    ]);
}