export function getDefaultNoteFields() {
    return [
        {
            static: true,
            id: 'id',
            title: 'ID',
            color: '#ffffff',
            type: 'text'
        },
        {
            static: true,
            id: 'creationDate',
            title: 'Creation date',
            color: '#ffffff',
            type: 'dateTime'
        },
        {
            static: true,
            id: 'updateDate',
            title: 'Update date',
            color: '#ffffff',
            type: 'dateTime'
        },
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