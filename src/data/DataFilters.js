export function getSearchFilter(searchValue) {
    return {
        id: 'search',
        title: 'Search',
        icon: 'search',
        condition: {
            id: '1',
            field: 'title',
            type: 'contains',
            value: searchValue
        }
    };
}

export function getDefaultSelectedFilter() {
    return getGeneralFilters().find(filter => filter.id === 'all');
}

export function getGeneralFilters() {
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
                field: 'duedate',
                type: 'equal',
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
                field: 'duedate',
                type: 'before',
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
                field: 'completed',
                type: 'equal',
                value: false
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
                field: 'completed',
                type: 'equal',
                value: false
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
                value: 'next_action'
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
    ]
}