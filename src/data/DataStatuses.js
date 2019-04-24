export function getStatus(statusId) {
    return getStatuses().find(status => status.id === statusId);
}

export function getStatuses() {
    return [
        {
            id: 'active',
            title: 'Active',
            color: '#f4511e'
        },
        {
            id: 'cancelled',
            title: 'Cancelled',
            color: '#90a4ae'
        },
        {
            id: 'delegated',
            title: 'Delegated',
            color: '#'
        },
        {
            id: 'hold',
            title: 'Hold',
            color: '#fdd835'
        },
        {
            id: 'nextAction',
            title: 'Next Action',
            color: '#2abff9'
        },
        {
            id: 'none',
            title: 'None',
            color: '#ffffff'
        },
        {
            id: 'planning',
            title: 'Planning',
            color: '#7cb342'
        },
        {
            id: 'postponed',
            title: 'Postponed',
            color: '#00796b'
        },
        {
            id: 'reference',
            title: 'Reference',
            color: '#8e24aa'
        },
        {
            id: 'someday',
            title: 'Someday',
            color: '#795548'
        },
        {
            id: 'waiting',
            title: 'Waiting',
            color: '#ffb300'
        }
    ];
}