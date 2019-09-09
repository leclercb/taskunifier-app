import moment from 'moment';
import RRule from 'rrule';

export function canRepeat(task) {
    if (!task || !task.repeat) {
        return false;
    }

    if (!task.startDate && !task.dueDate) {
        return false;
    }

    return true;
}

export function getNextDate(repeat, start, now) {
    if (!repeat || !start) {
        return null;
    }

    try {
        if (repeat === 'PARENT') {
            // TODO repeat with parent
            return null;
        }

        if (repeat.includes(';FROMCOMP')) {
            repeat = repeat.replace(';FROMCOMP', '');
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
            repeat = repeat.replace(';FASTFORWARD', '');
            iterator = createIterator(true);
        }

        const rule = RRule.fromString(repeat);

        if (!rule.options.dtstart || moment(rule.options.dtstart).isBefore(moment(start))) {
            rule.options.dtstart = moment(start).toDate();
            rule.options.count = 999;

            const dates = rule.all(iterator);

            if (dates.length > 0) {
                return moment(dates[dates.length - 1]).toISOString();
            }
        }
    } catch (error) {
        // No next date
    }

    return null;
}