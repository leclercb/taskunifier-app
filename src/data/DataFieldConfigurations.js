import React from 'react';
import { Checkbox, Input, InputNumber, Select } from 'antd';
import ContextTitle from '../components/contexts/ContextTitle';
import ContextSelect from '../components/contexts/ContextSelect';
import FolderTitle from '../components/folders/FolderTitle';
import FolderSelect from '../components/folders/FolderSelect';
import GoalTitle from '../components/goals/GoalTitle';
import GoalSelect from '../components/goals/GoalSelect';
import LocationTitle from '../components/locations/LocationTitle';
import LocationSelect from '../components/locations/LocationSelect';

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
                valuePropName: 'checked',
                width: 100,
                alwaysInEdition: true,
                input: props => (
                    <Checkbox {...props} />
                ),
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
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
                valuePropName: 'value',
                width: 200,
                alwaysInEdition: false,
                input: props => (
                    <ContextSelect {...props} />
                ),
                render: (value, record, index) => (
                    <ContextTitle contextId={value} />
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
        case 'folder':
            configuration = {
                title: 'Folder',
                valuePropName: 'value',
                width: 200,
                alwaysInEdition: false,
                input: props => (
                    <FolderSelect {...props} />
                ),
                render: (value, record, index) => (
                    <FolderTitle folderId={value} />
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
                valuePropName: 'value',
                width: 200,
                alwaysInEdition: false,
                input: props => (
                    <GoalSelect {...props} />
                ),
                render: (value, record, index) => (
                    <GoalTitle goalId={value} />
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
                valuePropName: 'value',
                width: 200,
                alwaysInEdition: false,
                input: props => (
                    <LocationSelect {...props} />
                ),
                render: (value, record, index) => (
                    <LocationTitle locationId={value} />
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
                valuePropName: 'value',
                width: 150,
                alwaysInEdition: false,
                input: props => (
                    <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        {...props} />
                ),
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
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
                valuePropName: 'value',
                width: 150,
                alwaysInEdition: false,
                input: props => (
                    <InputNumber
                        formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/€\s?|(,*)/g, '')}
                        {...props} />
                ),
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
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
                valuePropName: 'value',
                width: 150,
                alwaysInEdition: false,
                input: props => (
                    <InputNumber {...props} />
                ),
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
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
        case 'text':
        default:
            configuration = {
                title: 'Text',
                valuePropName: 'value',
                width: 250,
                alwaysInEdition: false,
                input: props => (
                    <Input {...props} />
                ),
                render: (value, record, index) => value ? value : <span>&nbsp;</span>,
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