import uuid from 'uuid/v4';
import { clone } from 'utils/ObjectUtils';

export function combineConditions(filter, conditions) {
    if (!conditions || conditions.length === 0) {
        return filter;
    }

    filter = clone(filter);

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

export function createSearchNoteValueCondition(searchValue) {
    return {
        id: uuid(),
        field: 'title',
        type: 'containIgnoreCase',
        value: searchValue
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
            sorters: getDefaultNoteSorters()
        }
    ];
}

export function getDefaultNoteSorters() {
    return [
        {
            id: 'default-note-sorter_title',
            field: 'title',
            direction: 'ascending'
        }
    ];
}