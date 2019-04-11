import { getConditionsForType } from "./FieldUtils";

export const applyFilter = (filter, fields, tasks) => {
    if (!filter || !filter.condition) {
        return tasks;
    }
    
    return applyCondition(filter.condition, fields, task);
}

const applyCondition = (condition, fields, task) => {
    const field = fields.find(field => field.id === condition.field);

    if (!field) {
        return true;
    }

    if (condition.operator) {
        
    } else {
        const c = getConditionsForType(field.type).find(c => c.id === condition.type);

        if (!c) {
            return true;
        }

        return c.apply(condition.value, getValue(task, field.path));
    }
}

export const getConditionsForCheckbox = () => {
    return [
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
}

export const getConditionsForNumber = () => {
    return [
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
}

export const getConditionsForText = () => {
    return [
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
}