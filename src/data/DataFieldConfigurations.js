import React from 'react';
import { Checkbox, DatePicker, Input, InputNumber, Select } from 'antd';
import moment from 'moment';
import ContextTitle from '../components/contexts/ContextTitle';
import ContextSelect from '../components/contexts/ContextSelect';
import FolderTitle from '../components/folders/FolderTitle';
import FolderSelect from '../components/folders/FolderSelect';
import GoalTitle from '../components/goals/GoalTitle';
import GoalSelect from '../components/goals/GoalSelect';
import LocationTitle from '../components/locations/LocationTitle';
import LocationSelect from '../components/locations/LocationSelect';

function defaultGetValueFromEvent(e) {
    if (!e || !e.target) {
        return e;
    }
    const { target } = e;
    return target.type === 'checkbox' ? target.checked : target.value;
}

export function getFieldTypes() {
    return [
        'checkbox',
        'context',
        'folder',
        'goal',
        'location',
        'money_dollar',
        'money_euro',
        'number',
        'text'
    ];
}

export function getFieldConfiguration(type) {
    let configuration = null;

    switch (type) {
        case 'checkbox':
            configuration = {
                title: 'Boolean',
                width: 100,
                alwaysInEdition: true,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'checked',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <Checkbox {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    }
                ]
            };

            break;
        case 'context':
            configuration = {
                title: 'Context',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => (
                    <ContextTitle contextId={value} />
                ),
                input: props => (
                    <ContextSelect {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    }
                ]
            };

            break;
        case 'date':
            configuration = {
                title: 'Date',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: true,
                normalize: value => value ? moment(value) : null,
                valuePropName: 'value',
                getValueFromEvent: event => event ? event.toString() : null,
                render: (value, record, index) => value ? moment(value).format('DD-MM-YYYY') : <span>&nbsp;</span>,
                input: props => (
                    <DatePicker format="DD-MM-YYYY" {...props} />
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
                        type: 'not_equal',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    },
                    {
                        type: 'before',
                        title: 'Before',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue > taskValue;
                        }
                    },
                    {
                        type: 'before_or_equal',
                        title: 'Before or equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue >= taskValue;
                        }
                    },
                    {
                        type: 'after',
                        title: 'Before',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue > taskValue;
                        }
                    },
                    {
                        type: 'after_or_equal',
                        title: 'Before or equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue >= taskValue;
                        }
                    }
                ]
            };

            break;
        case 'folder':
            configuration = {
                title: 'Folder',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => (
                    <FolderTitle folderId={value} />
                ),
                input: props => (
                    <FolderSelect {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    }
                ]
            };

            break;
        case 'goal':
            configuration = {
                title: 'Goal',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => (
                    <GoalTitle goalId={value} />
                ),
                input: props => (
                    <GoalSelect {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    }
                ]
            };

            break;
        case 'importance':
            configuration = {
                title: 'Importance',
                width: 150,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber min={0} max={12} {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    }
                ]
            };

            break;
        case 'location':
            configuration = {
                title: 'Location',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => (
                    <LocationTitle locationId={value} />
                ),
                input: props => (
                    <LocationSelect {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    }
                ]
            };

            break;
        case 'money_dollar':
            configuration = {
                title: 'Money Dollar',
                width: 150,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    }
                ]
            };

            break;
        case 'money_euro':
            configuration = {
                title: 'Money Euro',
                width: 150,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber
                        formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/€\s?|(,*)/g, '')}
                        {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    }
                ]
            };

            break;
        case 'number':
            configuration = {
                title: 'Number',
                width: 150,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    }
                ]
            };

            break;
        case 'textarea':
            configuration = {
                title: 'Text Area',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <Input.TextArea autosize={true} {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    },
                    {
                        type: 'contains',
                        title: 'Contains',
                        apply: (conditionValue, taskValue) => {
                            return (taskValue || '').includes(conditionValue);
                        }
                    },
                    {
                        type: 'not_contains',
                        title: 'Does not contain',
                        apply: (conditionValue, taskValue) => {
                            return !(taskValue || '').includes(conditionValue);
                        }
                    }
                ]
            };

            break;
        case 'text':
        default:
            configuration = {
                title: 'Text',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: false,
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <Input {...props} />
                ),
                conditions: [
                    {
                        type: 'equals',
                        title: 'Equals',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue === taskValue;
                        }
                    },
                    {
                        type: 'not_equals',
                        title: 'Does not equal',
                        apply: (conditionValue, taskValue) => {
                            return conditionValue !== taskValue;
                        }
                    },
                    {
                        type: 'contains',
                        title: 'Contains',
                        apply: (conditionValue, taskValue) => {
                            return (taskValue || '').includes(conditionValue);
                        }
                    },
                    {
                        type: 'not_contains',
                        title: 'Does not contain',
                        apply: (conditionValue, taskValue) => {
                            return !(taskValue || '').includes(conditionValue);
                        }
                    }
                ]
            };

            break;
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