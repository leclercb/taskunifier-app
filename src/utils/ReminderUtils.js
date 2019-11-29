import moment from 'moment';

export function showReminder(date, reminder, currentDate = undefined) {
    if (date && reminder) {
        if (moment(currentDate).diff(moment(date).subtract(reminder, 'second')) > 0) {
            return true;
        }
    }

    return false;
}