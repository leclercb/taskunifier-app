import React from 'react';
import { Checkbox, Input, Select } from 'antd';

export function getFieldConfiguration(type) {
    let configuration = null;

    switch (type) {
        case 'checkbox':
            configuration = {
                valuePropName: 'checked',
                width: 100,
                alwaysInEdition: true,
                input: (ref, save) => <Checkbox ref={ref} onPressEnter={save} onBlur={save} />,
                render: (text, record, index) => text ? text : <span>&nbsp;</span>,
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
                valuePropName: 'value',
                width: 150,
                alwaysInEdition: false,
                input: (ref, save) => <Input ref={ref} onPressEnter={save} onBlur={save} />,
                render: (text, record, index) => text ? text : <span>&nbsp;</span>,
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
                valuePropName: 'value',
                width: 250,
                alwaysInEdition: false,
                input: (ref, save) => <Input ref={ref} onPressEnter={save} onBlur={save} />,
                render: (text, record, index) => text ? text : <span>&nbsp;</span>,
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