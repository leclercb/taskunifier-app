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

export function getNextDate(repeat, date) {
    if (!repeat || !date) {
        return null;
    }

    // TODO debug + repeat with parent

    try {
        const rule = RRule.fromString(repeat);
        console.log(rule);

        if (!rule.options.dtstart || moment(rule.options.dtstart).isBefore(moment(date))) {
            rule.options.dtstart = moment(date).toDate();
            rule.options.count = 5;

            const dates = rule.all();
            console.log(dates);

            if (dates.length > 0) {
                return moment(dates[0]).toISOString();
            }
        }
    } catch (error) {
        // No next date
    }

    return null;
}