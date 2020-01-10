import moment from 'moment';
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

export function createSearchTaskValueCondition(searchValue) {
    return {
        id: uuid(),
        field: 'title',
        type: 'containIgnoreCase',
        value: searchValue
    };
}

export function createNonCompletedTasksCondition() {
    return {
        id: uuid(),
        field: 'completed',
        type: 'equal',
        value: false
    };
}
export function createFutureTasksCondition() {
    return {
        id: uuid(),
        field: 'startDate',
        type: 'dateBeforeOrEqual',
        value: moment().toISOString()
    };
}

export function containsCompletedTaskCondition(filter) {
    return _containsCompletedTaskCondition(filter.condition);
}

function _containsCompletedTaskCondition(condition) {
    if (condition) {
        if (condition.operator) {
            if (condition.conditions) {
                for (let c of condition.conditions) {
                    if (_containsCompletedTaskCondition(c)) {
                        return true;
                    }
                }
            }
        } else {
            return condition.field === 'completed';
        }
    }

    return false;
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
            condition: null,
            sorters: getDefaultTaskSorters()
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
            },
            sorters: getDefaultTaskSorters()
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
            },
            sorters: getDefaultTaskSorters()
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
            },
            sorters: getDefaultTaskSorters()
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
            },
            sorters: getDefaultTaskSorters()
        },
        {
            id: 'importance',
            title: 'Importance',
            color: '#fcc635',
            icon: 'exclamation-triangle',
            condition: null,
            sorters: [
                {
                    id: 'importance',
                    field: 'importance',
                    direction: 'descending'
                },
                {
                    id: 'title',
                    field: 'title',
                    direction: 'ascending'
                }
            ]
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
            },
            sorters: getDefaultTaskSorters()
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
            },
            sorters: getDefaultTaskSorters()
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
            },
            sorters: getDefaultTaskSorters()
        }
    ];
}

export function getDefaultTaskSorters() {
    return [
        {
            id: 'default-task-sorter_dueDate',
            field: 'dueDate',
            direction: 'ascending'
        },
        {
            id: 'default-task-sorter_priority',
            field: 'priority',
            direction: 'descending'
        },
        {
            id: 'default-task-sorter_title',
            field: 'title',
            direction: 'ascending'
        }
    ];
}