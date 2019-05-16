import { addColorsToArray } from 'utils/ColorUtils';

export function getLinkedTaskFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'links',
            title: 'Links',
            type: 'linkedTaskLinks',
            editable: true
        },
        {
            static: true,
            id: 'task',
            title: 'Task',
            type: 'task',
            editable: true
        }
    ]);
}