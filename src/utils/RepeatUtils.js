export const formatRepeat = repeat => {
    return repeat ? JSON.stringify(repeat) : '';
}

export const getKeysForType = type => {
    if (!type) {
        return [];
    }

    switch (type) {
        case 'none':
            return []
        case 'everyDay':
            return []
        case 'everyWeekday':
            return []
        case 'everyWeekend':
            return []
        case 'everyXDays':
            return ['nbDays']
        case 'everySelectedDay':
            return ['dayOfWeek']
        case 'everyXWeeks':
            return ['nbWeeks']
        case 'everyXWeeksOnDaysY':
            return ['nbWeeks', 'daysOfWeek']
        case 'everyXMonths':
            return ['nbMonths']
        case 'dayXEveryYMonths':
            return ['dayNb', 'nbMonths']
        case 'weekXDayYEveryZMonths':
            return ['weekNb', 'dayOfWeek', 'nbMonths']
        case 'everyXYears':
            return ['nbYears']
        case 'withParent':
            return []
        default:
            return [];
    }
};