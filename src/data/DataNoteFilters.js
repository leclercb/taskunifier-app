import uuid from 'uuid/v4';
import { clone } from 'utils/ObjectUtils';

export function addSearchNoteValueCondition(filter, searchValue) {
    filter = clone(filter);

    const conditions = [
        {
            id: uuid(),
            field: 'title',
            type: 'containIgnoreCase',
            value: searchValue
        }
    ];

    if (filter.condition) {
        conditions.push(filter.condition);
    }

    return {
        ...filter,
        condition: {
            id: uuid(),
            operator: 'AND',
            conditions
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
            condition: null,
            sorters: getDefaultSorters()
        }
    ];
}

function getDefaultSorters() {
    return [
        {
            id: 'title',
            field: 'title',
            direction: 'ascending'
        }
    ];
}