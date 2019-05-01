export function getDefaultLinkedTaskFields() {
    return [
        {
            static: true,
            id: 'links',
            title: 'Links',
            color: '#ffffff',
            type: 'linkedTaskLinks'
        },
        {
            static: true,
            id: 'task',
            title: 'Task',
            color: '#ffffff',
            type: 'task'
        }
    ];
}