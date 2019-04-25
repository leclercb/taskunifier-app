export function getDefaultTaskFields(settings) {
    return [
        {
            static: true,
            id: 'title',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Title',
            color: '#ffffff',
            type: 'text'
        },
        {
            static: true,
            id: 'star',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Star',
            color: '#ffffff',
            type: 'star'
        },
        {
            static: true,
            id: 'completed',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Completed',
            color: '#ffffff',
            type: 'boolean'
        },
        {
            static: true,
            id: 'progress',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Progress',
            color: '#ffffff',
            type: 'progress'
        },
        {
            static: true,
            id: 'timer',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Timer',
            color: '#ffffff',
            type: 'timer'
        },
        {
            static: true,
            id: 'priority',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Priority',
            color: '#ffffff',
            type: 'priority'
        },
        {
            static: true,
            id: 'importance',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Importance',
            color: '#ffffff',
            type: 'importance'
        },
        {
            static: true,
            id: 'status',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Status',
            color: '#ffffff',
            type: 'status'
        },
        {
            static: true,
            id: 'startDate',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
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
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
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
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Tags',
            color: '#ffffff',
            type: 'tags'
        },
        {
            static: true,
            id: 'context',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Context',
            color: '#ffffff',
            type: 'context'
        },
        {
            static: true,
            id: 'folder',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Folder',
            color: '#ffffff',
            type: 'folder'
        },
        {
            static: true,
            id: 'goal',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Goal',
            color: '#ffffff',
            type: 'goal'
        },
        {
            static: true,
            id: 'location',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Location',
            color: '#ffffff',
            type: 'location'
        },
        {
            static: true,
            id: 'note',
            refIds: {},
            creationDate: 1554795587825,
            updateDate: 1554795587825,
            state: 'LOADED',
            title: 'Note',
            color: '#ffffff',
            type: 'textarea'
        }
    ];
}