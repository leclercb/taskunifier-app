import uuid from 'uuid/v4';
import { clone } from 'utils/ObjectUtils';

export function createSearchTaskFilter(searchValue) {
    return {
        id: 'search',
        title: 'Search',
        icon: 'search',
        condition: {
            id: uuid(),
            field: 'title',
            type: 'contain',
            value: searchValue
        }
    };
}

export function hasCompletedTaskConditionOnly(filter) {
    if (filter.condition) {
        return filter.condition.field === 'completed' &&
            filter.condition.type === 'equal' &&
            filter.condition.value === true;
    }

    return false;
}

export function addNonCompletedTasksCondition(filter) {
    filter = clone(filter);

    const conditions = [
        {
            id: uuid(),
            field: 'completed',
            type: 'equal',
            value: false
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

export function getDefaultSelectedTaskFilter() {
    return getGeneralTaskFilters().find(taskFilter => taskFilter.id === 'all');
}

export function getGeneralTaskFilters() {
    return [
        {
            id: 'all',
            title: 'All',
            icon: 'tasks',
            condition: null
        },
        {
            id: 'not-completed',
            title: 'Not Completed',
            color: '#0e80ea',
            icon: 'times',
            condition: {
                id: '1',
                field: 'completed',
                type: 'equal',
                value: false
            }
        },
        {
            id: 'due-today',
            title: 'Due Today',
            color: '#fcaf35',
            icon: 'calendar-alt',
            condition: {
                id: '1',
                field: 'dueDate',
                type: 'dateEqual',
                value: 0
            }
        },
        {
            id: 'overdue',
            title: 'Overdue',
            color: '#ff1111',
            icon: 'bomb',
            condition: {
                id: '1',
                field: 'dueDate',
                type: 'dateTimeBefore',
                value: 0
            }
        },
        {
            id: 'hot-list',
            title: 'Hot List',
            color: '#d83131',
            icon: 'pepper-hot',
            condition: {
                id: '1',
                operator: 'AND',
                conditions: [
                    {
                        id: '2',
                        field: 'dueDate',
                        type: 'dateBeforeOrEqual',
                        value: 3
                    },
                    {
                        id: '3',
                        field: 'priority',
                        type: 'greaterThanOrEqual',
                        value: 'high'
                    }
                ]
            }
        },
        {
            id: 'importance',
            title: 'Importance',
            color: '#fcc635',
            icon: 'exclamation-triangle',
            condition: {
                id: '1',
                field: 'completed',
                type: 'equal',
                value: false
            }
        },
        {
            id: 'starred',
            title: 'Starred',
            color: '#fcde35',
            icon: 'star',
            condition: {
                id: '1',
                field: 'star',
                type: 'equal',
                value: true
            }
        },
        {
            id: 'next-action',
            title: 'Next Action',
            color: '#2abff9',
            icon: 'chevron-circle-right',
            condition: {
                id: '1',
                field: 'status',
                type: 'equal',
                value: 'nextAction'
            }
        },
        {
            id: 'completed',
            title: 'Completed',
            color: '#17e510',
            icon: 'check',
            condition: {
                id: '1',
                field: 'completed',
                type: 'equal',
                value: true
            }
        }
    ];
}