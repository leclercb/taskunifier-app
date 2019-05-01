export function getDefaultNoteFields() {
    return [
        {
            static: true,
            id: 'title',
            title: 'Title',
            color: '#ffffff',
            type: 'text'
        },
        {
            static: true,
            id: 'star',
            title: 'Star',
            color: '#ffffff',
            type: 'star'
        },
        {
            static: true,
            id: 'tags',
            title: 'Tags',
            color: '#ffffff',
            type: 'tags'
        },
        {
            static: true,
            id: 'folder',
            title: 'Folder',
            color: '#ffffff',
            type: 'folder'
        }
    ];
}