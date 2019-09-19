import { addColorsToArray } from 'utils/ColorUtils';

export function getDefaultTaskFields(settings) {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: 'ID',
            type: 'text',
            editable: false,
            order: 1
        },
        {
            static: true,
            id: 'creationDate',
            title: 'Creation date',
            type: 'dateTime',
            editable: false,
            order: 2
        },
        {
            static: true,
            id: 'updateDate',
            title: 'Update date',
            type: 'dateTime',
            editable: false,
            order: 3
        },
        {
            static: true,
            id: 'completionDate',
            title: 'Completion date',
            type: 'dateTime',
            editable: false,
            order: 4
        },
        {
            static: true,
            id: 'title',
            title: 'Title',
            type: 'text',
            editable: true,
            order: 7
        },
        {
            static: true,
            id: 'star',
            title: 'Star',
            type: 'star',
            editable: true,
            order: 6
        },
        {
            static: true,
            id: 'completed',
            title: 'Completed',
            type: 'boolean',
            editable: true,
            order: 5
        },
        {
            static: true,
            id: 'progress',
            title: 'Progress',
            type: 'progress',
            editable: true,
            order: 8
        },
        {
            static: true,
            id: 'length',
            title: 'Length',
            type: 'length',
            editable: true,
            order: 9
        },
        {
            static: true,
            id: 'timer',
            title: 'Timer',
            type: 'timer',
            editable: true,
            order: 10
        },
        {
            static: true,
            id: 'priority',
            title: 'Priority',
            type: 'priority',
            editable: true,
            order: 11
        },
        {
            static: true,
            id: 'importance',
            title: 'Importance',
            type: 'importance',
            editable: true,
            order: 12
        },
        {
            static: true,
            id: 'status',
            title: 'Status',
            type: 'status',
            editable: true,
            order: 13
        },
        {
            static: true,
            id: 'startDate',
            title: 'Start date',
            type: (settings.showStartTime ? 'dateTime' : 'date'),
            editable: true,
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
            order: 14
        },
        {
            static: true,
            id: 'dueDate',
            title: 'Due date',
            type: (settings.showDueTime ? 'dateTime' : 'date'),
            editable: true,
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
            order: 15
        },
        {
            static: true,
            id: 'tags',
            title: 'Tags',
            type: 'tags',
            editable: true,
            order: 16
        },
        {
            static: true,
            id: 'context',
            title: 'Context',
            type: 'context',
            editable: true,
            order: 17
        },
        {
            static: true,
            id: 'folder',
            title: 'Folder',
            type: 'folder',
            editable: true,
            order: 18
        },
        {
            static: true,
            id: 'goal',
            title: 'Goal',
            type: 'goal',
            editable: true,
            order: 19
        },
        {
            static: true,
            id: 'location',
            title: 'Location',
            type: 'location',
            editable: true,
            order: 20
        },
        {
            static: true,
            id: 'repeat',
            title: 'Repeat',
            type: 'repeat',
            editable: true,
            order: 21
        },
        {
            static: true,
            id: 'startDateReminder',
            title: 'Start date reminder',
            type: 'reminder',
            editable: true,
            order: 22
        },
        {
            static: true,
            id: 'dueDateReminder',
            title: 'Due date reminder',
            type: 'reminder',
            editable: true,
            order: 23
        },
        {
            static: true,
            id: 'text',
            title: 'Text',
            type: 'textarea',
            editable: true,
            order: 24
        }
    ]);
}