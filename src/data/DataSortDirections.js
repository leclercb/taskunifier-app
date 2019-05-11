export function getSortDirection(sortDirectionId) {
    return getSortDirections().find(sortDirection => sortDirection.id === sortDirectionId);
}

export function getSortDirectionIndex(sortDirectionId) {
    return getSortDirections().findIndex(sortDirection => sortDirection.id === sortDirectionId) || 0;
}

export function getSortDirections() {
    return [
        {
            id: 'ascending',
            title: 'Ascending',
            color: '#4286f4'
        },
        {
            id: 'descending',
            title: 'Descending',
            color: '#f44174'
        }
    ];
}