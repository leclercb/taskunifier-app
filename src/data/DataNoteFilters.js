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
            directory: 'general',
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

export function createNoteFilterFromDefinition(filterDefinition, filters, settings) {
    switch (filterDefinition.type) {
        case 'default':
            return filters.find(filter => filter.id === filterDefinition.id);
        case 'general':
            return getGeneralNoteFilters().find(filter => filter.id === filterDefinition.id);
        case 'context':
        case 'folder':
        case 'goal':
        case 'location':
            return {
                id: filterDefinition.id,
                title: 'Generated Filter',
                condition: {
                    id: null,
                    field: filterDefinition.type,
                    type: 'equal',
                    value: filterDefinition.id
                },
                sorters: settings.categoryNoteSorters
            };
        case 'tags':
            return {
                id: filterDefinition.id,
                title: 'Generated Filter',
                condition: {
                    id: null,
                    field: filterDefinition.type,
                    type: 'contain',
                    value: [filterDefinition.id]
                },
                sorters: settings.categoryNoteSorters
            };
        default:
            return null;
    }
}