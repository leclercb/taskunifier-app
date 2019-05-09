export function getPriority(priorityId) {
    return getPriorities().find(priority => priority.id === priorityId);
}

export function getPriorityIndex(priorityId) {
    return getPriorities().findIndex(priority => priority.id === priorityId) || 0;
}

export function getPriorities() {
    return [
        {
            id: 'negative',
            title: 'Negative',
            color: '#90a4ae'
        },
        {
            id: 'low',
            title: 'Low',
            color: '#8bc34a'
        },
        {
            id: 'medium',
            title: 'Medium',
            color: '#ffeb3b'
        },
        {
            id: 'high',
            title: 'High',
            color: '#ffb300'
        },
        {
            id: 'top',
            title: 'Top',
            color: '#f4511e'
        }
    ];
}