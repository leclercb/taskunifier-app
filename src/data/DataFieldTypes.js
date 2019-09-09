import moment from 'moment';
import { getPriorityIndex } from 'data/DataPriorities';
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
    compareSortDirections,
    compareStatuses,
    compareStrings
} from 'utils/CompareUtils';
import { equals } from 'utils/ObjectUtils';
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

export function getConditionsForType(type) {
    return getFieldType(type).conditions;
}

export function getConditionsFieldTypeForType(type) {
    return getFieldType(type).conditionsFieldType;
}

export function getFieldType(type, options) {
    let configuration = null;

    switch (type) {
        case 'boolean': {
            configuration = {
                title: 'Boolean',
                allowCreation: true,
                width: 100,
                alwaysInEdition: true,
                valuePropName: 'checked',
                compare: (a, b) => compareBooleans(a, b),
                toString: value => toStringBoolean(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return !!conditionValue === !!objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return !!conditionValue !== !!objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'boolean',
                options: []
            };

            break;
        }
        case 'color': {
            configuration = {
                title: 'Color',
                allowCreation: true,
                width: 100,
                alwaysInEdition: false,
                valuePropName: 'color',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'color',
                options: []
            };

            break;
        }
        case 'contact': {
            configuration = {
                title: 'Contact',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareContacts(a, b, getContactsFilteredByVisibleState(state)),
                toString: (value, state) => toStringContact(value, getContactsFilteredByVisibleState(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'contact',
                options: []
            };

            break;
        }
        case 'context': {
            configuration = {
                title: 'Context',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getContextsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getContextsFilteredByVisibleState(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'context',
                options: []
            };

            break;
        }
        case 'date': {
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';

            configuration = {
                title: 'Date',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareDates(a, b, false),
                toString: value => toStringDate(value, dateFormat),
                conditions: [
                    {
                        type: 'dateEqual',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return true;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateNotEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return true;
                            }

                            return !moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateBefore',
                        title: 'Before',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateBeforeOrEqual',
                        title: 'Before or equals',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateAfter',
                        title: 'After',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isAfter(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateAfterOrEqual',
                        title: 'After or equals',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrAfter(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeEqual',
                        title: 'Equals',
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return true;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeNotEqual',
                        title: 'Does not equal',
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return true;
                            }

                            return !moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeBefore',
                        title: 'Before',
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeBeforeOrEqual',
                        title: 'Before or equals',
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeAfter',
                        title: 'After',
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isAfter(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeAfterOrEqual',
                        title: 'After or equals',
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrAfter(moment(conditionValue), 'day');
                        }
                    }
                ],
                conditionsFieldType: 'date',
                options: [
                    {
                        id: 'dateFormat',
                        title: 'Date format',
                        type: 'text'
                    }
                ]
            };

            break;
        }
        case 'dateTime': {
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';
            const timeFormat = options && options.timeFormat ? options.timeFormat : 'HH:mm';

            configuration = {
                title: 'Date time',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareDates(a, b, true),
                toString: value => toStringDate(value, `${dateFormat} ${timeFormat}`),
                conditions: [
                    {
                        type: 'dateEqual',
                        title: 'Equals (compare date only)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return true;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateNotEqual',
                        title: 'Does not equal (compare date only)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return true;
                            }

                            return !moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateBefore',
                        title: 'Before (compare date only)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateBeforeOrEqual',
                        title: 'Before or equals (compare date only)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateAfter',
                        title: 'After (compare date only)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isAfter(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateAfterOrEqual',
                        title: 'After or equals (compare date only)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrAfter(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeEqual',
                        title: 'Equals (compare date and time)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return true;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(conditionValue).isSame(moment(objectValue), 'minute');
                        }
                    },
                    {
                        type: 'dateTimeNotEqual',
                        title: 'Does not equal (compare date and time)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return true;
                            }

                            return !moment(conditionValue).isSame(moment(objectValue), 'minute');
                        }
                    },
                    {
                        type: 'dateTimeBefore',
                        title: 'Before (compare date and time)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isBefore(moment(conditionValue), 'minute');
                        }
                    },
                    {
                        type: 'dateTimeBeforeOrEqual',
                        title: 'Before or equals (compare date and time)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrBefore(moment(conditionValue), 'minute');
                        }
                    },
                    {
                        type: 'dateTimeAfter',
                        title: 'After (compare date and time)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isAfter(moment(conditionValue), 'minute');
                        }
                    },
                    {
                        type: 'dateTimeAfterOrEqual',
                        title: 'After or equals (compare date and time)',
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrAfter(moment(conditionValue), 'minute');
                        }
                    }
                ],
                conditionsFieldType: 'dateTime',
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

            break;
        }
        case 'file': {
            configuration = {
                title: 'File',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    },
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').includes(conditionValue);
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').includes(conditionValue);
                        }
                    }
                ],
                conditionsFieldType: 'file',
                options: []
            };

            break;
        }
        case 'folder': {
            configuration = {
                title: 'Folder',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getFoldersFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getFoldersFilteredByVisibleState(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'folder',
                options: []
            };

            break;
        }
        case 'goal': {
            configuration = {
                title: 'Goal',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getGoalsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getGoalsFilteredByVisibleState(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'goal',
                options: []
            };

            break;
        }
        case 'goalContributesTo': {
            configuration = {
                title: 'Goal Contributes To',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getGoalsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getGoalsFilteredByVisibleState(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'goalContributesTo',
                options: []
            };

            break;
        }
        case 'goalLevel': {
            configuration = {
                title: 'Goal Level',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareGoalLevels(a, b),
                toString: value => toStringGoalLevel(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'goalLevel',
                options: []
            };

            break;
        }
        case 'importance': {
            configuration = {
                title: 'Importance',
                allowCreation: true,
                width: 150,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    },
                    {
                        type: 'greaterThan',
                        title: 'Greater than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue < objectValue;
                        }
                    },
                    {
                        type: 'greaterThanOrEqual',
                        title: 'Greater than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue <= objectValue;
                        }
                    },
                    {
                        type: 'lessThan',
                        title: 'Less than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue > objectValue;
                        }
                    },
                    {
                        type: 'lessThanOrEqual',
                        title: 'Less than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue >= objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'importance',
                options: []
            };

            break;
        }
        case 'length': {
            configuration = {
                title: 'Length',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'duration',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringDuration(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    },
                    {
                        type: 'greaterThan',
                        title: 'Greater than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue < objectValue;
                        }
                    },
                    {
                        type: 'greaterThanOrEqual',
                        title: 'Greater than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue <= objectValue;
                        }
                    },
                    {
                        type: 'lessThan',
                        title: 'Less than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue > objectValue;
                        }
                    },
                    {
                        type: 'lessThanOrEqual',
                        title: 'Less than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue >= objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'length',
                options: []
            };

            break;
        }
        case 'linkedContactLinks': {
            configuration = {
                title: 'Linked Contact Links',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                conditions: [
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            const taskLinks = objectValue || [];
                            const conditionLinks = conditionValue || [];

                            return conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            const taskLinks = objectValue || [];
                            const conditionLinks = conditionValue || [];

                            return !conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                        }
                    }
                ],
                conditionsFieldType: 'linkedContactLinks',
                options: []
            };

            break;
        }
        case 'linkedFileLinks': {
            configuration = {
                title: 'Linked File Links',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                conditions: [
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            const taskLinks = objectValue || [];
                            const conditionLinks = conditionValue || [];

                            return conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            const taskLinks = objectValue || [];
                            const conditionLinks = conditionValue || [];

                            return !conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                        }
                    }
                ],
                conditionsFieldType: 'linkedFileLinks',
                options: []
            };

            break;
        }
        case 'linkedTaskLinks': {
            configuration = {
                title: 'Linked Task Links',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                conditions: [
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            const taskLinks = objectValue || [];
                            const conditionLinks = conditionValue || [];

                            return conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            const taskLinks = objectValue || [];
                            const conditionLinks = conditionValue || [];

                            return !conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                        }
                    }
                ],
                conditionsFieldType: 'linkedTaskLinks',
                options: []
            };

            break;
        }
        case 'location': {
            configuration = {
                title: 'Location',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getLocationsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getLocationsFilteredByVisibleState(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'location',
                options: []
            };

            break;
        }
        case 'money': {
            const currency = options && options.currency ? options.currency : '€';

            configuration = {
                title: 'Money',
                allowCreation: true,
                width: 150,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value, currency + ' '),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    },
                    {
                        type: 'greaterThan',
                        title: 'Greater than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue < objectValue;
                        }
                    },
                    {
                        type: 'greaterThanOrEqual',
                        title: 'Greater than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue <= objectValue;
                        }
                    },
                    {
                        type: 'lessThan',
                        title: 'Less than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue > objectValue;
                        }
                    },
                    {
                        type: 'lessThanOrEqual',
                        title: 'Less than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue >= objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'money',
                options: [
                    {
                        id: 'currency',
                        title: 'Currency',
                        type: 'text'
                    }
                ]
            };

            break;
        }
        case 'note': {
            configuration = {
                title: 'Note',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getNotesFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getNotesFilteredByVisibleState(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'note',
                options: []
            };

            break;
        }
        case 'noteField': {
            configuration = {
                title: 'Note Field',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getNoteFieldsIncludingDefaults(state)),
                toString: (value, state) => toStringObject(value, getNoteFieldsIncludingDefaults(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'noteField',
                options: []
            };

            break;
        }
        case 'number': {
            configuration = {
                title: 'Number',
                allowCreation: true,
                width: 150,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    },
                    {
                        type: 'greaterThan',
                        title: 'Greater than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue < objectValue;
                        }
                    },
                    {
                        type: 'greaterThanOrEqual',
                        title: 'Greater than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue <= objectValue;
                        }
                    },
                    {
                        type: 'lessThan',
                        title: 'Less than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue > objectValue;
                        }
                    },
                    {
                        type: 'lessThanOrEqual',
                        title: 'Less than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue >= objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'number',
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

            break;
        }
        case 'password': {
            configuration = {
                title: 'Password',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toStringPassword(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    },
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').includes(conditionValue);
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').includes(conditionValue);
                        }
                    }
                ],
                conditionsFieldType: 'password',
                options: []
            };

            break;
        }
        case 'priority': {
            configuration = {
                title: 'Priority',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => comparePriorities(a, b),
                toString: value => toStringPriority(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    },
                    {
                        type: 'greaterThan',
                        title: 'Greater than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return getPriorityIndex(conditionValue) < getPriorityIndex(objectValue);
                        }
                    },
                    {
                        type: 'greaterThanOrEqual',
                        title: 'Greater than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return getPriorityIndex(conditionValue) <= getPriorityIndex(objectValue);
                        }
                    },
                    {
                        type: 'lessThan',
                        title: 'Less than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return getPriorityIndex(conditionValue) > getPriorityIndex(objectValue);
                        }
                    },
                    {
                        type: 'lessThanOrEqual',
                        title: 'Less than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return getPriorityIndex(conditionValue) >= getPriorityIndex(objectValue);
                        }
                    }
                ],
                conditionsFieldType: 'priority',
                options: []
            };

            break;
        }
        case 'progress': {
            configuration = {
                title: 'Progress',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value, '', '%'),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    },
                    {
                        type: 'greaterThan',
                        title: 'Greater than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue < objectValue;
                        }
                    },
                    {
                        type: 'greaterThanOrEqual',
                        title: 'Greater than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue <= objectValue;
                        }
                    },
                    {
                        type: 'lessThan',
                        title: 'Less than',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue > objectValue;
                        }
                    },
                    {
                        type: 'lessThanOrEqual',
                        title: 'Less than or equal',
                        apply: (conditionValue, objectValue) => {
                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return conditionValue >= objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'progress',
                options: []
            };

            break;
        }
        case 'reminder': {
            configuration = {
                title: 'Reminder',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'duration',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringDuration(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return equals(conditionValue, objectValue);
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return !equals(conditionValue, objectValue);
                        }
                    }
                ],
                conditionsFieldType: 'reminder',
                options: []
            };

            break;
        }
        case 'repeat': {
            configuration = {
                title: 'Repeat',
                allowCreation: false,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'repeat',
                compare: (a, b) => compareRepeats(a, b),
                toString: value => toStringRepeat(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return equals(conditionValue, objectValue);
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return !equals(conditionValue, objectValue);
                        }
                    }
                ],
                conditionsFieldType: 'repeat',
                options: []
            };

            break;
        }
        case 'select': {
            configuration = {
                title: 'Select',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'select',
                options: [
                    {
                        id: 'values',
                        title: 'Values',
                        type: 'selectTags'
                    }
                ]
            };

            break;
        }
        case 'selectTags': {
            configuration = {
                title: 'Select Tags',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                conditions: [
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            const taskTags = objectValue || [];
                            const conditionTags = conditionValue || [];

                            return conditionTags.every(conditionTag => taskTags.includes(conditionTag));
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            const taskTags = objectValue || [];
                            const conditionTags = conditionValue || [];

                            return !conditionTags.every(conditionTag => taskTags.includes(conditionTag));
                        }
                    }
                ],
                conditionsFieldType: 'selectTags',
                options: [
                    {
                        id: 'values',
                        title: 'Values',
                        type: 'selectTags'
                    }
                ]
            };

            break;
        }
        case 'sortDirection': {
            configuration = {
                title: 'Sort Direction',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareSortDirections(a, b),
                toString: value => toStringSortDirection(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return !!conditionValue === !!objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return !!conditionValue !== !!objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'sortDirection',
                options: []
            };

            break;
        }
        case 'star': {
            configuration = {
                title: 'Star',
                allowCreation: true,
                width: 100,
                alwaysInEdition: true,
                valuePropName: 'checked',
                compare: (a, b) => compareBooleans(a, b),
                toString: value => toStringBoolean(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return !!conditionValue === !!objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return !!conditionValue !== !!objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'star',
                options: []
            };

            break;
        }
        case 'status': {
            configuration = {
                title: 'Status',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStatuses(a, b),
                toString: value => toStringStatus(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'status',
                options: []
            };

            break;
        }
        case 'tags': {
            configuration = {
                title: 'Tags',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                conditions: [
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            const taskTags = objectValue || [];
                            const conditionTags = conditionValue || [];

                            return conditionTags.every(conditionTag => taskTags.includes(conditionTag));
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            const taskTags = objectValue || [];
                            const conditionTags = conditionValue || [];

                            return !conditionTags.every(conditionTag => taskTags.includes(conditionTag));
                        }
                    }
                ],
                conditionsFieldType: 'tags',
                options: []
            };

            break;
        }
        case 'task': {
            configuration = {
                title: 'Task',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getTasksFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getTasksFilteredByVisibleState(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'task',
                options: []
            };

            break;
        }
        case 'taskField': {
            configuration = {
                title: 'Task Field',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getTaskFieldsIncludingDefaults(state)),
                toString: (value, state) => toStringObject(value, getTaskFieldsIncludingDefaults(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'taskField',
                options: []
            };

            break;
        }
        case 'taskTemplate': {
            configuration = {
                title: 'Task Template',
                allowCreation: false,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getTaskTemplatesFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getTaskTemplatesFilteredByVisibleState(state)),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'taskTemplate',
                options: []
            };

            break;
        }
        case 'textarea': {
            configuration = {
                title: 'Text Area',
                allowCreation: false,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    },
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').includes(conditionValue);
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').includes(conditionValue);
                        }
                    }
                ],
                conditionsFieldType: 'textarea',
                options: []
            };

            break;
        }
        case 'timer': {
            configuration = {
                title: 'Timer',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'timer',
                compare: () => 0,
                toString: value => toStringTimer(value),
                conditions: [
                    {
                        type: 'started',
                        title: 'Started',
                        apply: (conditionValue, objectValue) => {
                            const startDate = objectValue ? objectValue.startDate : null;
                            return !!startDate === conditionValue;
                        }
                    }
                ],
                conditionsFieldType: 'boolean',
                options: []
            };

            break;
        }
        case 'text':
        default: {
            configuration = {
                title: 'Text',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                conditions: [
                    {
                        type: 'equal',
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue === objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return conditionValue !== objectValue;
                        }
                    },
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').includes(conditionValue);
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').includes(conditionValue);
                        }
                    }
                ],
                conditionsFieldType: 'text',
                options: []
            };

            break;
        }
    }

    return configuration;
}