export function getNoteSorterFields() {
    return [
        {
            static: true,
            id: 'field',
            title: 'Field',
            color: '#ffffff',
            type: 'noteField'
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