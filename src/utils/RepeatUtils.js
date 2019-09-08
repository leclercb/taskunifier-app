import moment from 'moment';
import RRule from 'rrule';

export function canRepeat(task) {
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
}

export function getNextDate(repeat, date) {
    if (!repeat || !date) {
        return null;
    }

    // TODO repeat with parent

    try {
        const rule = RRule.fromString(repeat);

        if (!rule.options.dtstart || moment(rule.options.dtstart).isBefore(moment(date))) {
            rule.options.dtstart = moment(date).toDate();
            rule.options.count = 1;

            const dates = rule.all();

            if (dates.length === 1) {
                return moment(dates[0]).toISOString();
            }
        }
    } catch (error) {
        // No next date
    }

    return null;
}