import { addColorsToArray } from 'utils/ColorUtils';

export function getDefaultTaskFields(settings) {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: 'ID',
            type: 'text',
            editable: false,
            defaultOrder: 1
        },
        {
            static: true,
            id: 'creationDate',
            title: 'Creation date',
            type: 'dateTime',
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
            editable: false,
            defaultOrder: 2
        },
        {
            static: true,
            id: 'updateDate',
            title: 'Update date',
            type: 'dateTime',
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
            editable: false,
            defaultOrder: 3
        },
        {
            static: true,
            id: 'completionDate',
            title: 'Completion date',
            type: 'dateTime',
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
            editable: false,
            defaultOrder: 4
        },
        {
            static: true,
            id: 'title',
            title: 'Title',
            type: 'text',
            editable: true,
            defaultOrder: 7
        },
        {
            static: true,
            id: 'star',
            title: 'Star',
            type: 'star',
            editable: true,
            defaultOrder: 6
        },
        {
            static: true,
            id: 'completed',
            title: 'Completed',
            type: 'boolean',
            editable: true,
            defaultOrder: 5
        },
        {
            static: true,
            id: 'progress',
            title: 'Progress',
            type: 'progress',
            editable: true,
            defaultOrder: 8
        },
        {
            static: true,
            id: 'length',
            title: 'Length',
            type: 'length',
            editable: true,
            defaultOrder: 9
        },
        {
            static: true,
            id: 'timer',
            title: 'Timer',
            type: 'timer',
            editable: true,
            defaultOrder: 10
        },
        {
            static: true,
            id: 'priority',
            title: 'Priority',
            type: 'priority',
            editable: true,
            defaultOrder: 11
        },
        {
            static: true,
            id: 'importance',
            title: 'Importance',
            type: 'importance',
            editable: true,
            defaultOrder: 12
        },
        {
            static: true,
            id: 'status',
            title: 'Status',
            type: 'status',
            editable: true,
            defaultOrder: 13
        },
        {
            static: true,
            id: 'startDate',
            title: 'Start date',
            type: (settings.showStartTime ? 'dateTime' : 'date'),
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
            editable: true,
            defaultOrder: 14
        },
        {
            static: true,
            id: 'dueDate',
            title: 'Due date',
            type: (settings.showDueTime ? 'dateTime' : 'date'),
            options: {
                dateFormat: settings.dateFormat,
                timeFormat: settings.timeFormat
            },
            editable: true,
            defaultOrder: 15
        },
        {
            static: true,
            id: 'tags',
            title: 'Tags',
            type: 'tags',
            editable: true,
            defaultOrder: 16
        },
        {
            static: true,
            id: 'context',
            title: 'Context',
            type: 'context',
            editable: true,
            defaultOrder: 17
        },
        {
            static: true,
            id: 'folder',
            title: 'Folder',
            type: 'folder',
            editable: true,
            defaultOrder: 18
        },
        {
            static: true,
            id: 'goal',
            title: 'Goal',
            type: 'goal',
            editable: true,
            defaultOrder: 19
        },
        {
            static: true,
            id: 'location',
            title: 'Location',
            type: 'location',
            editable: true,
            defaultOrder: 20
        },
        {
            static: true,
            id: 'repeat',
            title: 'Repeat',
            type: 'repeat',
            editable: true,
            defaultOrder: 21
        },
        {
            static: true,
            id: 'startDateReminder',
            title: 'Start date reminder',
            type: 'reminder',
            editable: true,
            defaultOrder: 22
        },
        {
            static: true,
            id: 'dueDateReminder',
            title: 'Due date reminder',
            type: 'reminder',
            editable: true,
            defaultOrder: 23
        },
        {
            static: true,
            id: 'text',
            title: 'Text',
            type: 'richtext',
            editable: true,
            defaultOrder: 24
        }
    ]);
}