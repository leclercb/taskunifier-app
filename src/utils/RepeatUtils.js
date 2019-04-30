export const getKeysForType = type => {
    if (!type) {
        return [];
    }

    switch (type) {
        case 'none':
            return [];
        case 'everyDay':
            return [];
        case 'everyWeekday':
            return [];
        case 'everyWeekend':
            return [];
        case 'everyXDays':
            return ['nbDays'];
        case 'everySelectedDay':
            return ['dayOfWeek'];
        case 'everyXWeeks':
            return ['nbWeeks'];
        case 'everyXWeeksOnDaysY':
            return ['nbWeeks', 'daysOfWeek'];
        case 'everyXMonths':
            return ['nbMonths'];
        case 'dayXEveryYMonths':
            return ['dayNb', 'nbMonths'];
        case 'weekXDayYEveryZMonths':
            return ['weekNb', 'dayOfWeek', 'nbMonths'];
        case 'everyXYears':
            return ['nbYears'];
        case 'withParent':
            return [];
        default:
            return [];
    }
};

export const getDaysOfWeek = () => {
    return [
        {
            label: 'Monday',
            value: 'monday'
        },
        {
            label: 'Tuesday',
            value: 'tuesday'
        },
        {
            label: 'Wednesday',
            value: 'wednesday'
        },
        {
            label: 'Thursday',
            value: 'thursday'
        },
        {
            label: 'Friday',
            value: 'friday'
        },
        {
            label: 'Saturday',
            value: 'saturday'
        },
        {
            label: 'Sunday',
            value: 'sunday'
        }
    ];
};

export const getWeekNumbers = () => {
    return [
        {
            label: 'first',
            value: 'first'
        },
        {
            label: 'second',
            value: 'second'
        },
        {
            label: 'third',
            value: 'third'
        },
        {
            label: 'fourth',
            value: 'fourth'
        },
        {
            label: 'last',
            value: 'last'
        }
    ];
};

export const formatRepeat = repeat => {
    if (!repeat || !repeat.type) {
        return '';
    }

    switch (repeat.type) {
        case 'none':
            return '';
        case 'everyDay':
            return 'Every day';
        case 'everyWeekday':
            return 'Every weekday';
        case 'everyWeekend':
            return 'Every weekend';
        case 'everyXDays':
            return `Every ${repeat.nbDays} day${repeat.nbDays > 1 ? 's' : ''}`;
        case 'everySelectedDay':
            return `Every ${formatDayOfWeek(repeat.dayOfWeek)}`;
        case 'everyXWeeks':
            return `Every ${repeat.nbWeeks} week${repeat.nbWeeks > 1 ? 's' : ''}`;
        case 'everyXWeeksOnDaysY':
            return `Every ${repeat.nbWeeks} week${repeat.nbWeeks > 1 ? 's' : ''} on ${repeat.dayOfWeek}`;
        case 'everyXMonths':
            return `Every ${repeat.nbMonths} month${repeat.nbMonths > 1 ? 's' : ''}`;
        case 'dayXEveryYMonths':
            return `Every ${formatDayNb(repeat.dayNb)}th day of every ${repeat.nbMonths} month${repeat.nbMonths > 1 ? 's' : ''}`;
        case 'weekXDayYEveryZMonths':
            return `Every ${formatWeekNb(repeat.weekNb)} ${formatDayOfWeek(repeat.dayOfWeek)} of every ${repeat.nbMonths} month${repeat.nbMonths > 1 ? 's' : ''}`;
        case 'everyXYears':
            return `Every ${repeat.nbYears} week${repeat.nbYears > 1 ? 's' : ''}`;
        case 'withParent':
            return 'With parent';
        default:
            return '';
    }
};

export const formatDayOfWeek = dayOfWeek => {
    const item = getDaysOfWeek().find(item => item.value === dayOfWeek);
    return item ? item.label : null;
};

export const formatDayNb = dayNb => {
    switch (dayNb) {
        case 1:
            return dayNb + 'st';
        case 2:
            return dayNb + 'nd';
        case 3:
            return dayNb + 'rd';
        default:
            return dayNb + 'th';
    }
};

export const formatWeekNb = weekNb => {
    const item = getWeekNumbers().find(item => item.value === weekNb);
    return item ? item.label : null;
};