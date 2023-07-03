import moment from 'moment';
import { RRule } from 'rrule';

export function getOptionsFromValue(value) {
    try {
        const options = RRule.parseString(value.replace(';FROMCOMP', '').replace(';FASTFORWARD', ''));

        if ('dtstart' in options) {
            options.dtstart = moment(options.dtstart).startOf('day').toDate();
        }

        if ('until' in options) {
            options.until = moment(options.until).endOf('day').toDate();
        }

        return options;
    } catch (error) {
        return null;
    }
}

export function canRepeat(task) {
    if (!task || !task.repeat) {
        return false;
    }

    if (!task.startDate && !task.dueDate) {
        return false;
    }

    return true;
}

export function isRepeatWithParent(repeat) {
    return repeat === 'PARENT';
}

export function getNextDate(repeat, start, now) {
    if (!repeat || !start) {
        return null;
    }

    try {
        if (repeat === 'PARENT') {
            return null;
        }

        if (repeat.includes(';FROMCOMP')) {
            start = now;
        }

        let stop = false;

        let createIterator = (afterNow = false) => date => {
            if (stop) {
                return false;
            }

            if (afterNow && moment(start).isBefore(now)) {
                if (moment(date).isSameOrAfter(moment(now)) && !moment(date).isSame(moment(now), 'day')) {
                    stop = true;
                }
            } else {
                if (!moment(date).isSame(moment(start), 'day')) {
                    stop = true;
                }
            }

            return true;
        };

        let iterator = createIterator(false);

        if (repeat.includes(';FASTFORWARD')) {
            iterator = createIterator(true);
        }

        const options = getOptionsFromValue(repeat);

        const rule = new RRule({
            ...options,
            dtstart: moment(start).toDate(),
            count: 999
        });

        const dates = rule.all(iterator);

        if (dates.length > 0) {
            const nextDate = moment(dates[dates.length - 1]);

            if (!options.dtstart || moment(options.dtstart).isSameOrBefore(nextDate)) {
                if (moment(start).isBefore(nextDate)) {
                    return nextDate.toISOString();
                }
            }
        }
    } catch (error) {
        // No next date
    }

    return null;
}