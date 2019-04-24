import React from 'react';
import { Checkbox, DatePicker, Input, InputNumber, Progress, Select, Tag } from 'antd';
import moment from 'moment';
import { escape } from '../utils/RegexUtils';
import ColorPicker from '../components/common/ColorPicker';
import ExtendedDatePicker from '../components/common/ExtendedDatePicker';
import StarCheckbox from '../components/common/StarCheckbox';
import ContactTitle from '../components/contacts/ContactTitle';
import ContactSelect from '../components/contacts/ContactSelect';
import ContextTitle from '../components/contexts/ContextTitle';
import ContextSelect from '../components/contexts/ContextSelect';
import FolderTitle from '../components/folders/FolderTitle';
import FolderSelect from '../components/folders/FolderSelect';
import GoalTitle from '../components/goals/GoalTitle';
import GoalSelect from '../components/goals/GoalSelect';
import LocationTitle from '../components/locations/LocationTitle';
import LocationSelect from '../components/locations/LocationSelect';
import PriorityTitle from '../components/priorities/PriorityTitle';
import PrioritySelect from '../components/priorities/PrioritySelect';
import StatusTitle from '../components/statuses/StatusTitle';
import StatusSelect from '../components/statuses/StatusSelect';
import TagsTitle from '../components/tags/TagsTitle';
import TagsSelect from '../components/tags/TagsSelect';
import { TaskTemplateTitle } from '../components/tasktemplates/TaskTemplateTitle';
import TaskTemplateSelect from '../components/tasktemplates/TaskTemplateSelect';
import { getPriorityIndex } from 'data/DataPriorities';

function defaultGetValueFromEvent(e) {
    if (!e || !e.target) {
        return e;
    }
    const { target } = e;
    return target.type === 'checkbox' ? target.checked : target.value;
}

export function getFieldTypes() {
    return [
        'boolean',
        'color',
        'contact',
        'context',
        'date',
        'dateTime',
        'folder',
        'goal',
        'importance',
        'location',
        'money',
        'number',
        'priority',
        'progress',
        'select',
        'selectTags',
        'star',
        'status',
        'tags',
        'taskTemplate',
        'text',
        'textarea'
    ];
}

export function getFieldConfiguration(type, options) {
    let configuration = null;

    switch (type) {
        case 'boolean': {
            configuration = {
                title: 'Boolean',
                width: 100,
                alwaysInEdition: true,
                commitOnChange: true,
                normalize: value => value,
                valuePropName: 'checked',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => <Checkbox checked={!!value} />,
                input: props => (
                    <Checkbox {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'color': {
            configuration = {
                title: 'Color',
                width: 100,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'color',
                getValueFromEvent: event => event.color,
                render: value => <ColorPicker color={value} />,
                input: props => (
                    <ColorPicker {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'contact': {
            configuration = {
                title: 'Contact',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => (
                    <ContactTitle contextId={value} />
                ),
                input: props => (
                    <ContactSelect {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'context': {
            configuration = {
                title: 'Context',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => (
                    <ContextTitle contextId={value} />
                ),
                input: props => (
                    <ContextSelect {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'date': {
            const extended = options && options.extended === true;
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';

            configuration = {
                title: 'Date',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: true,
                normalize: value => {
                    if (Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value) : null;
                },
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => {
                    if (extended && Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value).format(dateFormat) : (<span>&nbsp;</span>);
                },
                input: props => extended ?
                    <ExtendedDatePicker format={dateFormat} {...props} /> :
                    <DatePicker format={dateFormat} {...props} />,
                conditions: [
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
                ],
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
            const extended = options && options.extended === true;
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';
            const timeFormat = options && options.timeFormat ? options.timeFormat : 'HH:mm';

            configuration = {
                title: 'Date time',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: true,
                normalize: value => {
                    if (Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value) : null;
                },
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => {
                    if (extended && Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value).format(`${dateFormat} ${timeFormat}`) : (<span>&nbsp;</span>);
                },
                input: props => extended ?
                    <ExtendedDatePicker showTime={{ format: timeFormat }} format={`${dateFormat} ${timeFormat}`} {...props} /> :
                    <DatePicker showTime={{ format: timeFormat }} format={`${dateFormat} ${timeFormat}`} {...props} />,
                conditions: [
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
                ],
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
        case 'folder': {
            configuration = {
                title: 'Folder',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => (
                    <FolderTitle folderId={value} />
                ),
                input: props => (
                    <FolderSelect {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'goal': {
            configuration = {
                title: 'Goal',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => (
                    <GoalTitle goalId={value} />
                ),
                input: props => (
                    <GoalSelect {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'importance': {
            configuration = {
                title: 'Importance',
                width: 150,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber min={0} max={12} {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'location': {
            configuration = {
                title: 'Location',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => (
                    <LocationTitle locationId={value} />
                ),
                input: props => (
                    <LocationSelect {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'money': {
            const currency = options && options.currency ? options.currency : '€';

            configuration = {
                title: 'Money Dollar',
                width: 150,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => value ? currency + ' ' + value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber
                        formatter={value => `${currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace('/(' + escape(currency) + ')\\s?|(,*)/g', '')}
                        {...props} />
                ),
                conditions: [
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
                ],
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
        case 'number': {
            const min = options && options.min ? options.min : -Infinity;
            const max = options && options.max ? options.max : Infinity;

            configuration = {
                title: 'Number',
                width: 150,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber min={min} max={max} {...props} />
                ),
                conditions: [
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
                ],
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
        case 'priority': {
            configuration = {
                title: 'Priority',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => (
                    <PriorityTitle priorityId={value} />
                ),
                input: props => (
                    <PrioritySelect {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'progress': {
            configuration = {
                title: 'Progress',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => value ? <Progress percent={value} size="small" /> : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber min={0} max={100} {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'select': {
            let values = options && options.values ? options.values : [];
            values = Array.isArray(values) ? values : [values];

            configuration = {
                title: 'Select',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => (
                    value ? value : <span>&nbsp;</span>
                ),
                input: props => (
                    <Select {...props}>
                        {values.map(value => {
                            value = typeof value === 'object' ? value : {
                                title: value,
                                value: value
                            };

                            return (
                                <Select.Option key={value.value} value={value.value}>
                                    {value.title}
                                </Select.Option>
                            );
                        })}
                    </Select>
                ),
                conditions: [
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
                ],
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
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: values => (
                    values ? values.map(value => (<Tag key={value}>{value}</Tag>)) : <span>&nbsp;</span>
                ),
                input: props => (
                    <Select mode="tags" {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'star': {
            configuration = {
                title: 'Star',
                width: 100,
                alwaysInEdition: true,
                commitOnChange: true,
                normalize: value => value,
                valuePropName: 'checked',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => <StarCheckbox checked={!!value} />,
                input: props => (
                    <StarCheckbox {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'status': {
            configuration = {
                title: 'Status',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => (
                    <StatusTitle statusId={value} />
                ),
                input: props => (
                    <StatusSelect {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'tags': {
            configuration = {
                title: 'Tags',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => (
                    <TagsTitle tagIds={value} />
                ),
                input: props => (
                    <TagsSelect {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'taskTemplate': {
            configuration = {
                title: 'Task Template',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => (
                    <TaskTemplateTitle taskTemplateId={value} />
                ),
                input: props => (
                    <TaskTemplateSelect {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'textarea': {
            configuration = {
                title: 'Text Area',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <Input.TextArea autosize={true} {...props} onPressEnter={null} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
        case 'text':
        default: {
            configuration = {
                title: 'Text',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <Input {...props} />
                ),
                conditions: [
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
                ],
                options: []
            };

            break;
        }
    }

    configuration.select = () => (
        <Select>
            {configuration.conditions.map(condition => (
                <Select.Option key={condition.type} value={condition.type}>
                    {condition.title}
                </Select.Option>
            ))}
        </Select>
    );

    return configuration;
}