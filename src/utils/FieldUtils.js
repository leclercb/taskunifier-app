import React from 'react';
import { Checkbox, Input, Select } from 'antd';

export const getWidthForType = type => {
    switch (type) {
        case 'checkbox':
            return 100;
        case 'number':
            return 150;
        case 'text':
        default:
            return 250;
    }
}

export const isAlwaysInEdition = type => {
    switch (type) {
        case 'checkbox':
            return true;
        case 'text':
        default:
            return false;
    }
}

export const getRenderForType = type => (text, record, index) => {
    switch (type) {
        case 'checkbox':
        case 'text':
        default:
            return text ? text : <span>&nbsp;</span>;
    }
}

export const getValuePropName = type => {
    switch (type) {
        case 'checkbox':
            return 'checked';
        case 'text':
        default:
            return 'value';
    }
}

export const getInputForType = (type, ref, save) => {
    switch (type) {
        case 'checkbox':
            return (
                <Checkbox
                    ref={ref}
                    onPressEnter={save}
                    onBlur={save} />
            );
        case 'text':
        default:
            return (
                <Input
                    ref={ref}
                    onPressEnter={save}
                    onBlur={save} />
            );
    }
}

export const getSelectForType = type => {
    return (
        <Select>
            {getConditionsForType(type).map(condition => (
                <Select.Option key={condition.id} value={condition.id}>
                    {condition.title}
                </Select.Option>
            ))}
        </Select>
    );
}

export const getConditionsForType = type => {
    switch (type) {
        case 'checkbox':
            return getConditionsForCheckbox();
        case 'number':
            return getConditionsForNumber();
        case 'text':
        default:
            return getConditionsForText();
    }
}

export const getConditionsForCheckbox = () => {
    return [
        {
            id: 'equals',
            title: 'Equals'
        },
        {
            id: 'not_equals',
            title: 'Does not equal'
        }
    ]
}

export const getConditionsForNumber = () => {
    return [
        {
            id: 'equals',
            title: 'Equals'
        },
        {
            id: 'not_equals',
            title: 'Does not equal'
        }
    ]
}

export const getConditionsForText = () => {
    return [
        {
            id: 'equals',
            title: 'Equals'
        },
        {
            id: 'not_equals',
            title: 'Does not equal'
        },
        {
            id: 'contains',
            title: 'Contains'
        },
        {
            id: 'not_contains',
            title: 'Does not contain'
        }
    ]
}