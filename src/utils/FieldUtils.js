import { getFieldType } from 'data/DataFieldTypes';

export function getWidthForType(type) {
    return getFieldType(type).width;
}

export function isAlwaysInEditionForType(type) {
    return getFieldType(type).alwaysInEdition;
}

export function isCommitOnChangeForType(type) {
    return getFieldType(type).commitOnChange;
}

export function getNormalizeForType(type) {
    return getFieldType(type).normalize;
}

export function getValuePropNameForType(type) {
    return getFieldType(type).valuePropName;
}

export function getValueFromEventForType(type) {
    return getFieldType(type).getValueFromEvent;
}

export function getCompareForType(type, a, b, state) {
    return getFieldType(type).compare(a, b, state);
}

export function getToStringForType(type, options, value, state) {
    return getFieldType(type, options).toString(value, state);
}

export function getRenderForType(type, options, value, props) {
    return getFieldType(type, options).render(value, props);
}

export function getInputForType(type, options, props) {
    return getFieldType(type, options).input(props);
}

export function getSelectForType(type) {
    return getFieldType(type).select();
}

export function getConditionsFieldTypeForType(type) {
    return getFieldType(type).conditionsFieldType;
}