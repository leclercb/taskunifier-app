import moment from 'moment';
import { getContactsFilteredByVisibleState } from 'selectors/ContactSelectors';
import { getContextsFilteredByVisibleState } from 'selectors/ContextSelectors';
import { getFoldersFilteredByVisibleState } from 'selectors/FolderSelectors';
import { getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getNotesFilteredByVisibleState } from 'selectors/NoteSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getTaskTemplatesFilteredByVisibleState } from 'selectors/TaskTemplateSelectors';
import {
    compareBooleans,
    compareContacts,
    compareDates,
    compareGoalLevels,
    compareNumbers,
    compareObjects,
    comparePriorities,
    compareRepeats,
    compareRichTexts,
    compareSortDirections,
    compareStatuses,
    compareStrings
} from 'utils/CompareUtils';
import {
    toString,
    toStringArray,
    toStringBoolean,
    toStringContact,
    toStringDate,
    toStringDuration,
    toStringGoalLevel,
    toStringNumber,
    toStringObject,
    toStringPassword,
    toStringPriority,
    toStringRepeat,
    toStringRichText,
    toStringSortDirection,
    toStringStatus,
    toStringTimer
} from 'utils/StringUtils';

export function getFieldTypes() {
    return [
        'boolean',
        'color',
        'contact',
        'context',
        'date',
        'dateTime',
        'file',
        'folder',
        'goal',
        'goalContributesTo',
        'goalLevel',
        'importance',
        'length',
        'linkedContactLinks',
        'linkedFileLinks',
        'linkedTaskLinks',
        'location',
        'money',
        'note',
        'noteField',
        'number',
        'password',
        'priority',
        'progress',
        'reminder',
        'repeat',
        'richtext',
        'select',
        'selectTags',
        'sortDirection',
        'star',
        'status',
        'tags',
        'task',
        'taskField',
        'taskTemplate',
        'text',
        'textarea',
        'timer'
    ];
}

export function getObjectsForFieldType(state, type) {
    switch (type) {
        case 'contact':
            return getContactsFilteredByVisibleState(state);
        case 'context':
            return getContextsFilteredByVisibleState(state);
        case 'folder':
            return getFoldersFilteredByVisibleState(state);
        case 'goal':
            return getGoalsFilteredByVisibleState(state);
        case 'goalContributesTo':
            return getGoalsFilteredByVisibleState(state);
        case 'location':
            return getLocationsFilteredByVisibleState(state);
        case 'note':
            return getNotesFilteredByVisibleState(state);
        case 'noteField':
            return getNoteFieldsIncludingDefaults(state);
        case 'task':
            return getTasksFilteredByVisibleState(state);
        case 'taskField':
            return getTaskFieldsIncludingDefaults(state);
        case 'taskTemplate':
            return getTaskTemplatesFilteredByVisibleState(state);
        default:
            return null;
    }
}

export function getWidthForType(type) {
    return getFieldType(type).width;
}

export function isAlwaysInEditionForType(type) {
    return getFieldType(type).alwaysInEdition;
}

export function getValuePropNameForType(type) {
    return getFieldType(type).valuePropName;
}

export function getCompareForType(type, a, b, state) {
    return getFieldType(type).compare(a, b, state);
}

export function getToStringForType(type, options, value, state) {
    return getFieldType(type, options).toString(value, state);
}

export function getFieldType(type, options) {
    switch (type) {
        case 'boolean': {
            return {
                title: 'Boolean',
                allowCreation: true,
                width: 80,
                alwaysInEdition: true,
                valuePropName: 'checked',
                compare: (a, b) => compareBooleans(a, b),
                toString: value => toStringBoolean(value),
                options: []
            };
        }
        case 'color': {
            return {
                title: 'Color',
                allowCreation: true,
                width: 100,
                alwaysInEdition: false,
                valuePropName: 'color',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: []
            };
        }
        case 'contact': {
            return {
                title: 'Contact',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareContacts(a, b, getContactsFilteredByVisibleState(state)),
                toString: (value, state) => toStringContact(value, getContactsFilteredByVisibleState(state)),
                options: []
            };
        }
        case 'context': {
            return {
                title: 'Context',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getContextsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getContextsFilteredByVisibleState(state)),
                options: []
            };
        }
        case 'date': {
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';

            return {
                title: 'Date',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => {
                    if (Number.isInteger(a)) {
                        a = moment().add(Number.parseInt(a), 'day').toISOString();
                    }

                    if (Number.isInteger(b)) {
                        b = moment().add(Number.parseInt(b), 'day').toISOString();
                    }

                    return compareDates(a, b, false);
                },
                toString: value => {
                    if (Number.isInteger(value)) {
                        value = moment().add(Number.parseInt(value), 'day').toISOString();
                    }

                    return toStringDate(value, dateFormat);
                },
                options: [
                    {
                        id: 'dateFormat',
                        title: 'Date format',
                        type: 'text'
                    }
                ]
            };
        }
        case 'dateTime': {
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';
            const timeFormat = options && options.timeFormat ? options.timeFormat : 'HH:mm';

            return {
                title: 'Date time',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => {
                    if (Number.isInteger(a)) {
                        a = moment().add(Number.parseInt(a), 'day').toISOString();
                    }

                    if (Number.isInteger(b)) {
                        b = moment().add(Number.parseInt(b), 'day').toISOString();
                    }

                    return compareDates(a, b, true);
                },
                toString: value => {
                    if (Number.isInteger(value)) {
                        value = moment().add(Number.parseInt(value), 'day').toISOString();
                    }

                    return toStringDate(value, `${dateFormat} ${timeFormat}`);
                },
                options: [
                    {
                        id: 'dateFormat',
                        title: 'Date format',
                        type: 'text'
                    },
                    {
                        id: 'timeFormat',
                        title: 'Time format',
                        type: 'text'
                    }
                ]
            };
        }
        case 'file': {
            return {
                title: 'File',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: []
            };
        }
        case 'folder': {
            return {
                title: 'Folder',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getFoldersFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getFoldersFilteredByVisibleState(state)),
                options: []
            };
        }
        case 'goal': {
            return {
                title: 'Goal',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getGoalsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getGoalsFilteredByVisibleState(state)),
                options: []
            };
        }
        case 'goalContributesTo': {
            return {
                title: 'Goal Contributes To',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getGoalsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getGoalsFilteredByVisibleState(state)),
                options: []
            };
        }
        case 'goalLevel': {
            return {
                title: 'Goal Level',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareGoalLevels(a, b),
                toString: value => toStringGoalLevel(value),
                options: []
            };
        }
        case 'importance': {
            return {
                title: 'Importance',
                allowCreation: true,
                width: 150,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value),
                options: []
            };
        }
        case 'length': {
            return {
                title: 'Length',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'duration',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringDuration(value),
                options: []
            };
        }
        case 'linkedContactLinks': {
            return {
                title: 'Linked Contact Links',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                options: []
            };
        }
        case 'linkedFileLinks': {
            return {
                title: 'Linked File Links',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                options: []
            };
        }
        case 'linkedTaskLinks': {
            return {
                title: 'Linked Task Links',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                options: []
            };
        }
        case 'location': {
            return {
                title: 'Location',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getLocationsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getLocationsFilteredByVisibleState(state)),
                options: []
            };
        }
        case 'money': {
            const currency = options && options.currency ? options.currency : '€';

            return {
                title: 'Money',
                allowCreation: true,
                width: 150,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value, currency + ' '),
                options: [
                    {
                        id: 'currency',
                        title: 'Currency',
                        type: 'text'
                    }
                ]
            };
        }
        case 'note': {
            return {
                title: 'Note',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getNotesFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getNotesFilteredByVisibleState(state)),
                options: []
            };
        }
        case 'noteField': {
            return {
                title: 'Note Field',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getNoteFieldsIncludingDefaults(state)),
                toString: (value, state) => toStringObject(value, getNoteFieldsIncludingDefaults(state)),
                options: []
            };
        }
        case 'number': {
            return {
                title: 'Number',
                allowCreation: true,
                width: 150,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value),
                options: [
                    {
                        id: 'min',
                        title: 'Minimum',
                        type: 'number'
                    },
                    {
                        id: 'max',
                        title: 'Maximum',
                        type: 'number'
                    }
                ]
            };
        }
        case 'password': {
            return {
                title: 'Password',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toStringPassword(value),
                options: []
            };
        }
        case 'priority': {
            return {
                title: 'Priority',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => comparePriorities(a, b),
                toString: value => toStringPriority(value),
                options: []
            };
        }
        case 'progress': {
            return {
                title: 'Progress',
                allowCreation: true,
                width: 100,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value, '', '%'),
                options: []
            };
        }
        case 'reminder': {
            return {
                title: 'Reminder',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'duration',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringDuration(value),
                options: []
            };
        }
        case 'repeat': {
            return {
                title: 'Repeat',
                allowCreation: false,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'repeat',
                compare: (a, b) => compareRepeats(a, b),
                toString: value => toStringRepeat(value),
                options: []
            };
        }
        case 'richtext': {
            return {
                title: 'Rich Text',
                allowCreation: false,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareRichTexts(a, b),
                toString: value => toStringRichText(value),
                options: []
            };
        }
        case 'select': {
            return {
                title: 'Select',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: [
                    {
                        id: 'values',
                        title: 'Values',
                        type: 'selectTags'
                    }
                ]
            };
        }
        case 'selectTags': {
            return {
                title: 'Select Tags',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                options: [
                    {
                        id: 'values',
                        title: 'Values',
                        type: 'selectTags'
                    }
                ]
            };
        }
        case 'sortDirection': {
            return {
                title: 'Sort Direction',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareSortDirections(a, b),
                toString: value => toStringSortDirection(value),
                options: []
            };
        }
        case 'star': {
            return {
                title: 'Star',
                allowCreation: true,
                width: 80,
                alwaysInEdition: true,
                valuePropName: 'checked',
                compare: (a, b) => compareBooleans(a, b),
                toString: value => toStringBoolean(value),
                options: []
            };
        }
        case 'status': {
            return {
                title: 'Status',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStatuses(a, b),
                toString: value => toStringStatus(value),
                options: []
            };
        }
        case 'tags': {
            return {
                title: 'Tags',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                options: []
            };
        }
        case 'task': {
            return {
                title: 'Task',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getTasksFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getTasksFilteredByVisibleState(state)),
                options: []
            };
        }
        case 'taskField': {
            return {
                title: 'Task Field',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getTaskFieldsIncludingDefaults(state)),
                toString: (value, state) => toStringObject(value, getTaskFieldsIncludingDefaults(state)),
                options: []
            };
        }
        case 'taskTemplate': {
            return {
                title: 'Task Template',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getTaskTemplatesFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getTaskTemplatesFilteredByVisibleState(state)),
                options: []
            };
        }
        case 'textarea': {
            return {
                title: 'Text Area',
                allowCreation: false,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: []
            };
        }
        case 'timer': {
            return {
                title: 'Timer',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'timer',
                compare: () => 0,
                toString: value => toStringTimer(value),
                options: []
            };
        }
        case 'text':
        default: {
            return {
                title: 'Text',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: []
            };
        }
    }
}