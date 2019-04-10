import React from 'react';
import { Checkbox, Input, Select } from 'antd';
import { getConditionsForType } from '../../utils/FilterUtils';

export const isAlwaysInEdition = type => {
    switch (type) {
        case 'checkbox':
            return true;
        case 'text':
        default:
            return false;
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

export const getRenderFromType = type => (text, record, index) => {
    switch (type) {
        case 'checkbox':
        case 'text':
        default:
            return text ? text : <span>&nbsp;</span>;
    }
}

export const getSelectForType = type => {
    return <Select>
        {getConditionsForType(type).map(condition => (
            <Select.Option key={condition.id} value={condition.id}>
                {condition.title}
            </Select.Option>
        ))}
    </Select>
}

export const getInputFromType = (type, ref, save) => {
    switch (type) {
        case 'checkbox':
            return <Checkbox
                ref={ref}
                onPressEnter={save}
                onBlur={save} />;
        case 'text':
        default:
            return <Input
                ref={ref}
                onPressEnter={save}
                onBlur={save} />;
    }
}