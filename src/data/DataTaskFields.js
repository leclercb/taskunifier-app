export function getDefaultTaskFields(settings) {
    return [
        {
            static: true,
            id: 'id',
            title: 'ID',
            color: '#ffffff',
            type: 'text'
        },
        {
            static: true,
            id: 'creationDate',
            title: 'Creation date',
            color: '#ffffff',
            type: 'dateTime'
        },
        {
            static: true,
            id: 'updateDate',
            title: 'Update date',
            color: '#ffffff',
            type: 'dateTime'
        },
        {
            static: true,
            id: 'title',
            title: 'Title',
            color: '#ffffff',
            type: 'text'
        },
        {
            static: true,
            id: 'star',
            title: 'Star',
            color: '#ffffff',
            type: 'star'
        },
        {
            static: true,
            id: 'completed',
            title: 'Completed',
            color: '#ffffff',
            type: 'boolean'
        },
        {
            static: true,
            id: 'progress',
            title: 'Progress',
            color: '#ffffff',
            type: 'progress'
        },
        {
            static: true,
            id: 'length',
            title: 'Length',
            color: '#ffffff',
            type: 'length'
        },
        {
            static: true,
            id: 'timer',
            title: 'Timer',
            color: '#ffffff',
            type: 'timer'
        },
        {
            static: true,
            id: 'priority',
            title: 'Priority',
            color: '#ffffff',
            type: 'priority'
        },
        {
            static: true,
            id: 'importance',
            title: 'Importance',
            color: '#ffffff',
            type: 'importance'
        },
        {
            static: true,
            id: 'status',
            title: 'Status',
            color: '#ffffff',
            type: 'status'
        },
        {
            static: true,
            id: 'startDate',
            title: 'Start date',
            color: '#ffffff',
            type: (settings.showStartTime ? 'dateTime' : 'date'),
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            }
        },
        {
            static: true,
            id: 'dueDate',
            title: 'Due date',
            color: '#ffffff',
            type: (settings.showDueTime ? 'dateTime' : 'date'),
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            }
        },
        {
            static: true,
            id: 'tags',
            title: 'Tags',
            color: '#ffffff',
            type: 'tags'
        },
        {
            static: true,
            id: 'context',
            title: 'Context',
            color: '#ffffff',
            type: 'context'
        },
        {
            static: true,
            id: 'folder',
            title: 'Folder',
            color: '#ffffff',
            type: 'folder'
        },
        {
            static: true,
            id: 'goal',
            title: 'Goal',
            color: '#ffffff',
            type: 'goal'
        },
        {
            static: true,
            id: 'location',
            title: 'Location',
            color: '#ffffff',
            type: 'location'
        },
        {
            static: true,
            id: 'repeat',
            title: 'Repeat',
            color: '#ffffff',
            type: 'repeat'
        },
        {
            static: true,
            id: 'repeatFrom',
            title: 'Repeat From',
            color: '#ffffff',
            type: 'repeatFrom'
        },
        {
            static: true,
            id: 'startDateReminder',
            title: 'Start date reminder',
            color: '#ffffff',
            type: 'reminder'
        },
        {
            static: true,
            id: 'dueDateReminder',
            title: 'Due date reminder',
            color: '#ffffff',
            type: 'reminder'
        },
        {
            static: true,
            id: 'note',
            title: 'Note',
            color: '#ffffff',
            type: 'textarea'
        }
    ];
}