import { getConditionsFieldTypeForType, getConditionsForType, getFieldType } from 'data/DataFieldTypes';
import { store } from 'store/Store';
import { getValue } from 'utils/ObjectUtils';

export function toStringFilter(objectFilter, fields, state = store.getState()) {
    if (!objectFilter || !objectFilter.condition) {
        return '';
    }

    return _toStringFilter(objectFilter.condition, fields, state);
}

function _toStringFilter(condition, fields, state) {
    if (!condition) {
        return '';
    }

    if (condition.operator) {
        if (!condition.conditions || condition.conditions.length === 0) {
            return '';
        }

        let tokens = [];

        condition.conditions.forEach(condition => {
            const token = _toStringFilter(condition, fields, state);

            if (token) {
                tokens.push(token);
            }
        });

        switch (condition.operator) {
            case 'AND':
                return `(${tokens.join(' and ')})`;
            case 'OR':
                return `(${tokens.join(' or ')})`;
            case 'NOT':
                return `not (${tokens.join(', ')})`;
            default:
                return '';
        }

    } else {
        const field = fields.find(field => field.id === condition.field);

        if (!field) {
            return '';
        }

        const conditionDesc = getConditionsForType(field.type).find(c => c.type === condition.type);
        const conditionFieldType = getFieldType(getConditionsFieldTypeForType(field.type), null);

        return `${field.title} ${conditionDesc.title.toLocaleLowerCase()} ${conditionFieldType.toString(condition.value, state)}`;
    }
}

export function applyFilter(objectFilter, object, fields) {
    if (!objectFilter || !objectFilter.condition) {
        return true;
    }

    return applyCondition(objectFilter.condition, object, fields);
}

function applyCondition(condition, object, fields) {
    if (!condition) {
        return true;
    }

    if (condition.operator) {
        if (!condition.conditions || condition.conditions.length === 0) {
            return true;
        }

        switch (condition.operator) {
            case 'AND': {
                let result = true;

                for (let i = 0; i < condition.conditions.length; i++) {
                    result = result && applyCondition(condition.conditions[i], object, fields);

                    if (!result) {
                        return false;
                    }
                }

                return result;
            }
            case 'OR': {
                let result = false;

                for (let i = 0; i < condition.conditions.length; i++) {
                    result = result || applyCondition(condition.conditions[i], object, fields);

                    if (result) {
                        return true;
                    }
                }

                return result;
            }
            case 'NOT': {
                return !applyCondition(condition.conditions[0], object, fields);
            }
            default: {
                return true;
            }
        }
    } else {
        const field = fields.find(field => field.id === condition.field);

        if (!field) {
            return true;
        }

        const c = getConditionsForType(field.type).find(c => c.type === condition.type);

        if (!c) {
            return true;
        }

        return c.apply(condition.value, getValue(object, field.id));
    }
}