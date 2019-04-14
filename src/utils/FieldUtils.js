import { getFieldConfiguration } from '../data/DataFieldConfigurations';

export const getWidthForType = type => {
    return getFieldConfiguration(type).width;
}

export const isAlwaysInEdition = type => {
    return getFieldConfiguration(type).alwaysInEdition;
}

export const getRenderForType = type => (text, record, index) => {
    return getFieldConfiguration(type).render(text, record, index);
}

export const getValuePropName = type => {
    return getFieldConfiguration(type).valuePropName;
}

export const getInputForType = (type, props) => {
    return getFieldConfiguration(type).input(props);
}

export const getSelectForType = type => {
    return getFieldConfiguration(type).select();
}

export const getConditionsForType = type => {
    return getFieldConfiguration(type).conditions;
}