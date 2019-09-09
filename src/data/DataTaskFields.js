import { addColorsToArray } from 'utils/ColorUtils';

export function getDefaultTaskFields(settings) {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: 'ID',
            type: 'text',
            editable: false
        },
        {
            static: true,
            id: 'creationDate',
            title: 'Creation date',
            type: 'dateTime',
            editable: false
        },
        {
            static: true,
            id: 'updateDate',
            title: 'Update date',
            type: 'dateTime',
            editable: false
        },
        {
            static: true,
            id: 'completionDate',
            title: 'Completion date',
            type: 'dateTime',
            editable: false
        },
        {
            static: true,
            id: 'title',
            title: 'Title',
            type: 'text',
            editable: true
        },
        {
            static: true,
            id: 'star',
            title: 'Star',
            type: 'star',
            editable: true
        },
        {
            static: true,
            id: 'completed',
            title: 'Completed',
            type: 'boolean',
            editable: true
        },
        {
            static: true,
            id: 'progress',
            title: 'Progress',
            type: 'progress',
            editable: true
        },
        {
            static: true,
            id: 'length',
            title: 'Length',
            type: 'length',
            editable: true
        },
        {
            static: true,
            id: 'timer',
            title: 'Timer',
            type: 'timer',
            editable: true
        },
        {
            static: true,
            id: 'priority',
            title: 'Priority',
            type: 'priority',
            editable: true
        },
        {
            static: true,
            id: 'importance',
            title: 'Importance',
            type: 'importance',
            editable: true
        },
        {
            static: true,
            id: 'status',
            title: 'Status',
            type: 'status',
            editable: true
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
            }
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
            }
        },
        {
            static: true,
            id: 'tags',
            title: 'Tags',
            type: 'tags',
            editable: true
        },
        {
            static: true,
            id: 'context',
            title: 'Context',
            type: 'context',
            editable: true
        },
        {
            static: true,
            id: 'folder',
            title: 'Folder',
            type: 'folder',
            editable: true
        },
        {
            static: true,
            id: 'goal',
            title: 'Goal',
            type: 'goal',
            editable: true
        },
        {
            static: true,
            id: 'location',
            title: 'Location',
            type: 'location',
            editable: true
        },
        {
            static: true,
            id: 'repeat',
            title: 'Repeat',
            type: 'repeat',
            editable: true
        },
        {
            static: true,
            id: 'startDateReminder',
            title: 'Start date reminder',
            type: 'reminder',
            editable: true
        },
        {
            static: true,
            id: 'dueDateReminder',
            title: 'Due date reminder',
            type: 'reminder',
            editable: true
        },
        {
            static: true,
            id: 'text',
            title: 'Text',
            type: 'textarea',
            editable: true
        }
    ]);
}