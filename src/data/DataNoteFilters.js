import uuid from 'uuid/v4';

export function createSearchNoteFilter(searchValue) {
    return {
        id: 'search',
        title: 'Search',
        icon: 'search',
        condition: {
            id: uuid(),
            field: 'title',
            type: 'contains',
            value: searchValue
        }
    };
}

export function getDefaultSelectedNoteFilter() {
    return getGeneralNoteFilters().find(noteFilter => noteFilter.id === 'all');
}

export function getGeneralNoteFilters() {
    return [
        {
            id: 'all',
            title: 'All',
            icon: 'book',
            condition: null
        }
    ];
}