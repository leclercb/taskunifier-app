import moment from 'moment';
import { compareDates } from 'utils/CompareUtils';

export function getWorkLogsWithLength(workLogs) {
    return (workLogs || []).map(workLog => ({
        ...workLog,
        length: getDuration(workLog)
    })).sort((a, b) => compareDates(a.start, b.start));
}

export function getWorkLogsWithTimer(workLogs, timer, date) {
    const newWorkLogs = [...(workLogs || [])];
    const workLogForTimer = getWorkLogForTimer(timer, date);

    if (workLogForTimer) {
        newWorkLogs.push(workLogForTimer);
    }

    return newWorkLogs;
}

export function getWorkLogForTimer(timer, date) {
    if (timer && timer.startDate) {
        return {
            start: timer.startDate,
            end: date
        };
    }

    return null;
}

export function getDuration(workLog) {
    if (workLog.start && workLog.end && moment(workLog.start).isBefore(workLog.end)) {
        const diff = moment(workLog.end).diff(workLog.start, 'second');
        return Math.max(diff, 0);
    }

    return 0;
}

export function getDurationForDay(workLog, date) {
    if (workLog.start && workLog.end && moment(workLog.start).isBefore(workLog.end)) {
        const start = moment.max(moment(workLog.start), moment(date).startOf('day'));
        const end = moment.min(moment(workLog.end), moment(date).endOf('day'));
        const diff = end.diff(start, 'second');
        return Math.max(diff, 0);
    }

    return 0;
}

export function getDurationUntilNow(workLog, now) {
    if (workLog.start && moment(workLog.start).isBefore(workLog.end)) {
        const start = moment(workLog.start);
        const end = moment.min(moment(workLog.end), moment(now));
        const diff = end.diff(start, 'second');
        return Math.max(diff, 0);
    }

    return 0;
}