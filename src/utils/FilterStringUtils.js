import { getConditionsFieldTypeForType, getConditionsForType } from 'data/DataFieldFilterTypes';
import { getFieldType } from 'data/DataFieldTypes';
import { store } from 'store/Store';

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