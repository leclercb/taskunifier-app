/* eslint react/display-name: 0 */

import moment from 'moment';
import { getPriorityIndex } from 'data/DataPriorities';
import { equals } from 'utils/ObjectUtils';

export function getFieldConditions(type) {
    switch (type) {
        case 'boolean': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return !!conditionValue === !!taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return !!conditionValue !== !!taskValue;
                    }
                }
            ];
        }
        case 'color': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'contact': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'context': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'date': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue && !taskValue) {
                            return true;
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return moment(conditionValue).isSame(moment(taskValue), 'day');
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue && !taskValue) {
                            return false;
                        }

                        if (!conditionValue || !taskValue) {
                            return true;
                        }

                        return !moment(conditionValue).isSame(moment(taskValue), 'day');
                    }
                },
                {
                    type: 'before',
                    title: 'Before',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return moment(taskValue).isBefore(moment(conditionValue), 'day');
                    }
                },
                {
                    type: 'beforeOrEqual',
                    title: 'Before or equals',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return moment(taskValue).isSameOrBefore(moment(conditionValue), 'day');
                    }
                },
                {
                    type: 'after',
                    title: 'After',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return moment(taskValue).isAfter(moment(conditionValue), 'day');
                    }
                },
                {
                    type: 'afterOrEqual',
                    title: 'After or equals',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return moment(taskValue).isSameOrAfter(moment(conditionValue), 'day');
                    }
                }
            ];
        }
        case 'dateTime': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue && !taskValue) {
                            return true;
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return moment(conditionValue).isSame(moment(taskValue), 'minute');
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue && !taskValue) {
                            return false;
                        }

                        if (!conditionValue || !taskValue) {
                            return true;
                        }

                        return !moment(conditionValue).isSame(moment(taskValue), 'minute');
                    }
                },
                {
                    type: 'before',
                    title: 'Before',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return moment(taskValue).isBefore(moment(conditionValue), 'minute');
                    }
                },
                {
                    type: 'beforeOrEqual',
                    title: 'Before or equals',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return moment(taskValue).isSameOrBefore(moment(conditionValue), 'minute');
                    }
                },
                {
                    type: 'after',
                    title: 'After',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return moment(taskValue).isAfter(moment(conditionValue), 'minute');
                    }
                },
                {
                    type: 'afterOrEqual',
                    title: 'After or equals',
                    apply: (conditionValue, taskValue) => {
                        if (Number.isInteger(conditionValue)) {
                            conditionValue = moment().add(Number.parseInt(conditionValue), 'days').toJSON();
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return moment(taskValue).isSameOrAfter(moment(conditionValue), 'minute');
                    }
                }
            ];
        }
        case 'folder': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'goal': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'importance': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                },
                {
                    type: 'greaterThan',
                    title: 'Greater than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue < taskValue;
                    }
                },
                {
                    type: 'greaterThanOrEqual',
                    title: 'Greater than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue <= taskValue;
                    }
                },
                {
                    type: 'lessThan',
                    title: 'Less than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue > taskValue;
                    }
                },
                {
                    type: 'lessThanOrEqual',
                    title: 'Less than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue >= taskValue;
                    }
                }
            ];
        }
        case 'length': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                },
                {
                    type: 'greaterThan',
                    title: 'Greater than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue < taskValue;
                    }
                },
                {
                    type: 'greaterThanOrEqual',
                    title: 'Greater than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue <= taskValue;
                    }
                },
                {
                    type: 'lessThan',
                    title: 'Less than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue > taskValue;
                    }
                },
                {
                    type: 'lessThanOrEqual',
                    title: 'Less than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue >= taskValue;
                    }
                }
            ];
        }
        case 'linkedContactLinks': {
            return [
                {
                    type: 'contain',
                    title: 'Contains',
                    apply: (conditionValue, taskValue) => {
                        const taskLinks = taskValue || [];
                        const conditionLinks = conditionValue || [];

                        return conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                    }
                },
                {
                    type: 'notContain',
                    title: 'Does not contain',
                    apply: (conditionValue, taskValue) => {
                        const taskLinks = taskValue || [];
                        const conditionLinks = conditionValue || [];

                        return !conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                    }
                }
            ];
        }
        case 'linkedFileLinks': {
            return [
                {
                    type: 'contain',
                    title: 'Contains',
                    apply: (conditionValue, taskValue) => {
                        const taskLinks = taskValue || [];
                        const conditionLinks = conditionValue || [];

                        return conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                    }
                },
                {
                    type: 'notContain',
                    title: 'Does not contain',
                    apply: (conditionValue, taskValue) => {
                        const taskLinks = taskValue || [];
                        const conditionLinks = conditionValue || [];

                        return !conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                    }
                }
            ];
        }
        case 'linkedTaskLinks': {
            return [
                {
                    type: 'contain',
                    title: 'Contains',
                    apply: (conditionValue, taskValue) => {
                        const taskLinks = taskValue || [];
                        const conditionLinks = conditionValue || [];

                        return conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                    }
                },
                {
                    type: 'notContain',
                    title: 'Does not contain',
                    apply: (conditionValue, taskValue) => {
                        const taskLinks = taskValue || [];
                        const conditionLinks = conditionValue || [];

                        return !conditionLinks.every(conditionLink => taskLinks.includes(conditionLink));
                    }
                }
            ];
        }
        case 'location': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'money': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                },
                {
                    type: 'greaterThan',
                    title: 'Greater than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue < taskValue;
                    }
                },
                {
                    type: 'greaterThanOrEqual',
                    title: 'Greater than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue <= taskValue;
                    }
                },
                {
                    type: 'lessThan',
                    title: 'Less than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue > taskValue;
                    }
                },
                {
                    type: 'lessThanOrEqual',
                    title: 'Less than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue >= taskValue;
                    }
                }
            ];
        }
        case 'note': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'number': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                },
                {
                    type: 'greaterThan',
                    title: 'Greater than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue < taskValue;
                    }
                },
                {
                    type: 'greaterThanOrEqual',
                    title: 'Greater than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue <= taskValue;
                    }
                },
                {
                    type: 'lessThan',
                    title: 'Less than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue > taskValue;
                    }
                },
                {
                    type: 'lessThanOrEqual',
                    title: 'Less than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue >= taskValue;
                    }
                }
            ];
        }
        case 'priority': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                },
                {
                    type: 'greaterThan',
                    title: 'Greater than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return getPriorityIndex(conditionValue) < getPriorityIndex(taskValue);
                    }
                },
                {
                    type: 'greaterThanOrEqual',
                    title: 'Greater than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return getPriorityIndex(conditionValue) <= getPriorityIndex(taskValue);
                    }
                },
                {
                    type: 'lessThan',
                    title: 'Less than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return getPriorityIndex(conditionValue) > getPriorityIndex(taskValue);
                    }
                },
                {
                    type: 'lessThanOrEqual',
                    title: 'Less than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return getPriorityIndex(conditionValue) >= getPriorityIndex(taskValue);
                    }
                }
            ];
        }
        case 'progress': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                },
                {
                    type: 'greaterThan',
                    title: 'Greater than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue < taskValue;
                    }
                },
                {
                    type: 'greaterThanOrEqual',
                    title: 'Greater than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue <= taskValue;
                    }
                },
                {
                    type: 'lessThan',
                    title: 'Less than',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue > taskValue;
                    }
                },
                {
                    type: 'lessThanOrEqual',
                    title: 'Less than or equal',
                    apply: (conditionValue, taskValue) => {
                        if (!conditionValue || !taskValue) {
                            return false;
                        }

                        return conditionValue >= taskValue;
                    }
                }
            ];
        }
        case 'repeat': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return equals(conditionValue, taskValue);
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return !equals(conditionValue, taskValue);
                    }
                }
            ];
        }
        case 'select': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'selectTags': {
            return [
                {
                    type: 'contain',
                    title: 'Contains',
                    apply: (conditionValue, taskValue) => {
                        const taskTags = taskValue || [];
                        const conditionTags = conditionValue || [];

                        return conditionTags.every(conditionTag => taskTags.includes(conditionTag));
                    }
                },
                {
                    type: 'notContain',
                    title: 'Does not contain',
                    apply: (conditionValue, taskValue) => {
                        const taskTags = taskValue || [];
                        const conditionTags = conditionValue || [];

                        return !conditionTags.every(conditionTag => taskTags.includes(conditionTag));
                    }
                }
            ];
        }
        case 'star': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return !!conditionValue === !!taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return !!conditionValue !== !!taskValue;
                    }
                }
            ];
        }
        case 'status': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'tags': {
            return [
                {
                    type: 'contain',
                    title: 'Contains',
                    apply: (conditionValue, taskValue) => {
                        const taskTags = taskValue || [];
                        const conditionTags = conditionValue || [];

                        return conditionTags.every(conditionTag => taskTags.includes(conditionTag));
                    }
                },
                {
                    type: 'notContain',
                    title: 'Does not contain',
                    apply: (conditionValue, taskValue) => {
                        const taskTags = taskValue || [];
                        const conditionTags = conditionValue || [];

                        return !conditionTags.every(conditionTag => taskTags.includes(conditionTag));
                    }
                }
            ];
        }
        case 'task': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'taskTemplate': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                }
            ];
        }
        case 'textarea': {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                },
                {
                    type: 'contain',
                    title: 'Contains',
                    apply: (conditionValue, taskValue) => {
                        return (taskValue || '').includes(conditionValue);
                    }
                },
                {
                    type: 'notContain',
                    title: 'Does not contain',
                    apply: (conditionValue, taskValue) => {
                        return !(taskValue || '').includes(conditionValue);
                    }
                }
            ];
        }
        case 'timer': {
            return [
                {
                    type: 'started',
                    title: 'Started',
                    apply: (conditionValue, taskValue) => {
                        const startDate = taskValue ? taskValue.startDate : null;
                        return !!startDate === conditionValue;
                    }
                }
            ];
        }
        case 'text':
        default: {
            return [
                {
                    type: 'equal',
                    title: 'Equals',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue === taskValue;
                    }
                },
                {
                    type: 'notEqual',
                    title: 'Does not equal',
                    apply: (conditionValue, taskValue) => {
                        return conditionValue !== taskValue;
                    }
                },
                {
                    type: 'contain',
                    title: 'Contains',
                    apply: (conditionValue, taskValue) => {
                        return (taskValue || '').includes(conditionValue);
                    }
                },
                {
                    type: 'notContain',
                    title: 'Does not contain',
                    apply: (conditionValue, taskValue) => {
                        return !(taskValue || '').includes(conditionValue);
                    }
                }
            ];
        }
    }
}