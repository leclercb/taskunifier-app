export function getWidthForType(type) {
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

export function getConditionsForType(type) {
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