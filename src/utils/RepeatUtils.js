import moment from 'moment';

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

export const canRepeat = task => {
    if (!task || !task.repeat || !task.repeat.type) {
        return false;
    }

    if (task.repeat.type === 'none') {
        return false;
    }

    if (!task.startDate && !task.dueDate) {
        return false;
    }

    return true;
};

export const getNextDate = (repeat, date) => {
    if (!repeat || !date) {
        return null;
    }

    switch (repeat.type) {
        case 'none': {
            return null;
        }
        case 'everyDay': {
            const d = moment(date);
            d.add(1, 'days');

            return d.toJSON();
        }
        case 'everyWeekday': {
            const days = [1, 2, 3, 4, 5];
            const d = moment(date);
            d.add(1, 'days');

            for (let i = 0; i < 7; i++) {
                if (!days.includes(d.isoWeekday())) {
                    d.add(1, 'days');
                }
            }

            return d.toJSON();
        }
        case 'everyWeekend': {
            const days = [6, 7];
            const d = moment(date);
            d.add(1, 'days');

            for (let i = 0; i < 7; i++) {
                if (!days.includes(d.isoWeekday())) {
                    d.add(1, 'days');
                }
            }

            return d.toJSON();
        }
        case 'everyXDays': {
            if (!repeat.nbDays) {
                return null;
            }

            const d = moment(date);
            d.add(repeat.nbDays, 'days');

            return d.toJSON();
        }
        case 'everySelectedDay': {
            if (!repeat.dayOfWeek) {
                return null;
            }

            const days = [Number(repeat.dayOfWeek)];
            const d = moment(date);
            d.add(1, 'days');

            for (let i = 0; i < 7; i++) {
                if (days.includes(d.isoWeekday())) {
                    return d.toJSON();
                } else {
                    d.add(1, 'days');
                }
            }

            return null;
        }
        case 'everyXWeeks': {
            if (!repeat.nbWeeks) {
                return null;
            }

            const d = moment(date);
            d.add(repeat.nbWeeks, 'weeks');

            return d.toJSON();
        }
        case 'everyXWeeksOnDaysY': {
            if (!repeat.nbWeeks || !repeat.daysOfWeek) {
                return null;
            }

            const days = repeat.daysOfWeek.map(dayOfWeek => Number(dayOfWeek));
            const d = moment(date);
            d.add(1, 'days');
            d.add(repeat.nbWeeks - 1, 'weeks');

            for (let i = 0; i < 7; i++) {
                if (days.includes(d.isoWeekday())) {
                    return d.toJSON();
                } else {
                    d.add(1, 'days');
                }
            }

            return null;
        }
        case 'everyXMonths': {
            if (!repeat.nbMonths) {
                return null;
            }

            const d = moment(date);
            d.add(repeat.nbMonths, 'months');

            return d.toJSON();
        }
        case 'dayXEveryYMonths': {
            if (!repeat.dayNb || !repeat.nbMonths) {
                return null;
            }

            const d = moment(date);
            const oldDate = d.date();
            const oldMonth = d.month();

            d.date(repeat.dayNb);

            if (oldDate < repeat.dayNb || d.month() !== oldMonth) {
                d.add(repeat.nbMonths - 1, 'months');
            } else {
                d.add(repeat.nbMonths, 'months');
            }

            return d.toJSON();
        }
        case 'weekXDayYEveryZMonths': {
            return null; // TODO implement
        }
        case 'everyXYears': {
            if (!repeat.nbYears) {
                return null;
            }

            const d = moment(date);
            d.add(repeat.nbYears, 'years');

            return d.toJSON();
        }
        case 'withParent': {
            return null; // TODO implement
        }
        default: {
            return null;
        }
    }
};

export const getDaysOfWeek = () => {
    return [
        {
            label: 'Monday',
            value: '1'
        },
        {
            label: 'Tuesday',
            value: '2'
        },
        {
            label: 'Wednesday',
            value: '3'
        },
        {
            label: 'Thursday',
            value: '4'
        },
        {
            label: 'Friday',
            value: '5'
        },
        {
            label: 'Saturday',
            value: '6'
        },
        {
            label: 'Sunday',
            value: '7'
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
            if (!repeat.nbDays) {
                return '';
            }

            return `Every ${repeat.nbDays} day${repeat.nbDays > 1 ? 's' : ''}`;
        case 'everySelectedDay':
            if (!repeat.dayOfWeek) {
                return '';
            }

            return `Every ${formatDayOfWeek(repeat.dayOfWeek)}`;
        case 'everyXWeeks':
            if (!repeat.nbWeeks) {
                return '';
            }

            return `Every ${repeat.nbWeeks} week${repeat.nbWeeks > 1 ? 's' : ''}`;
        case 'everyXWeeksOnDaysY':
            if (!repeat.nbWeeks || !repeat.daysOfWeek) {
                return '';
            }

            return `Every ${repeat.nbWeeks} week${repeat.nbWeeks > 1 ? 's' : ''} on ${repeat.daysOfWeek.map(dayOfWeek => formatDayOfWeek(dayOfWeek)).join(', ')}`;
        case 'everyXMonths':
            if (!repeat.nbMonths) {
                return '';
            }

            return `Every ${repeat.nbMonths} month${repeat.nbMonths > 1 ? 's' : ''}`;
        case 'dayXEveryYMonths':
            if (!repeat.dayNb || !repeat.nbMonths) {
                return '';
            }

            return `Every ${formatDayNb(repeat.dayNb)}th day of every ${repeat.nbMonths} month${repeat.nbMonths > 1 ? 's' : ''}`;
        case 'weekXDayYEveryZMonths':
            if (!repeat.weekNb || !repeat.dayOfWeek || !repeat.nbMonths) {
                return '';
            }

            return `Every ${formatWeekNb(repeat.weekNb)} ${formatDayOfWeek(repeat.dayOfWeek)} of every ${repeat.nbMonths} month${repeat.nbMonths > 1 ? 's' : ''}`;
        case 'everyXYears':
            if (!repeat.nbYears) {
                return '';
            }

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