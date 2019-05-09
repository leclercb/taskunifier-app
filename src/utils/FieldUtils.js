import { getFieldConfiguration } from 'data/DataFieldConfigurations';

export function getWidthForType(type) {
    return getFieldConfiguration(type).width;
}

export function isAlwaysInEditionForType(type) {
    return getFieldConfiguration(type).alwaysInEdition;
}

export function isCommitOnChangeForType(type) {
    return getFieldConfiguration(type).commitOnChange;
}

export function getNormalizeForType(type) {
    return getFieldConfiguration(type).normalize;
}

export function getValuePropNameForType(type) {
    return getFieldConfiguration(type).valuePropName;
}

export function getValueFromEventForType(type) {
    return getFieldConfiguration(type).getValueFromEvent;
}

export function getSortForType(type, a, b) {
    return getFieldConfiguration(type).sort(a, b);
}

export function getRenderForType(type, options, value, props) {
    return getFieldConfiguration(type, options).render(value, props);
}

export function getInputForType(type, options, props) {
    return getFieldConfiguration(type, options).input(props);
}

export function getSelectForType(type) {
    return getFieldConfiguration(type).select();
}

export function getConditionsFieldTypeForType(type) {
    return getFieldConfiguration(type).conditionsFieldType;
}