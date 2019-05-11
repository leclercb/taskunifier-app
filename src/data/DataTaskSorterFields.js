export function getTaskSorterFields() {
    return [
        {
            static: true,
            id: 'field',
            title: 'Field',
            color: '#ffffff',
            type: 'taskField'
        },
        {
            static: true,
            id: 'direction',
            title: 'Direction',
            color: '#ffffff',
            type: 'sortDirection'
        }
    ];
}