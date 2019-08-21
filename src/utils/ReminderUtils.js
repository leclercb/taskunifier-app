import moment from 'moment';

export function showReminder(date, reminder, currentDate = undefined) {
    if (date && reminder) {
        if (moment(currentDate).diff(moment(date).subtract(reminder, 'seconds')) > 0) {
            return true;
        }
    }

    return false;
}