export function getLinkedFileFields() {
    return [
        {
            static: true,
            id: 'links',
            title: 'Links',
            color: '#ffffff',
            type: 'linkedFileLinks'
        },
        {
            static: true,
            id: 'file',
            title: 'File',
            color: '#ffffff',
            type: 'text'
        }
    ];
}