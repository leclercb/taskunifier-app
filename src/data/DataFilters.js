export function getSearchFilter(searchValue) {
    return {
        id: "search",
        title: "Search",
        icon: "search",
        condition: {
            id: "1",
            field: "title",
            type: "contains",
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
            id: "all",
            title: "All",
            icon: "tasks",
            condition: null
        },
        {
            id: "not-completed",
            title: "Not Completed",
            icon: "check",
            condition: {
                id: "1",
                field: "completed",
                type: "equals",
                value: false
            }
        },
        {
            id: "due-today",
            title: "Due Today",
            icon: "calendar-alt",
            condition: {
                id: "1",
                field: "completed",
                type: "equals",
                value: false
            }
        },
        {
            id: "overdue",
            title: "Overdue",
            icon: "bomb",
            condition: {
                id: "1",
                field: "completed",
                type: "equals",
                value: false
            }
        },
        {
            id: "hot-list",
            title: "Hot List",
            icon: "pepper-hot",
            condition: {
                id: "1",
                field: "completed",
                type: "equals",
                value: false
            }
        },
        {
            id: "importance",
            title: "Importance",
            icon: "exclamation-triangle",
            condition: {
                id: "1",
                field: "completed",
                type: "equals",
                value: false
            }
        },
        {
            id: "starred",
            title: "Starred",
            icon: "star",
            condition: {
                id: "1",
                field: "completed",
                type: "equals",
                value: false
            }
        },
        {
            id: "next-action",
            title: "Next Action",
            icon: "chevron-circle-right",
            condition: {
                id: "1",
                field: "completed",
                type: "equals",
                value: false
            }
        },
        {
            id: "completed",
            title: "Completed",
            icon: "check-double",
            condition: {
                id: "1",
                field: "completed",
                condtypeition: "equals",
                value: true
            }
        }
    ]
}