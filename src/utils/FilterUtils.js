export function getConditionsForType(type) {
    switch (type) {
        case 'checkbox':
            return getConditionsForCheckbox();
        case 'number':
            return getConditionsForCheckbox();
        case 'text':
        default:
            return getConditionsForCheckbox();
    }
}

export function getConditionsForCheckbox() {
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

export function getConditionsForNumber() {
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

export function getConditionsForText() {
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