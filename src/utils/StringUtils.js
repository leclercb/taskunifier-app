import moment from 'moment';
import RRule from 'rrule';
import { getContactTitle } from 'utils/ContactUtils';
import { getGoalLevel } from 'data/DataGoalLevels';
import { getPriority } from 'data/DataPriorities';
import { getStatuses } from 'data/DataStatuses';
import { getSortDirections } from 'data/DataSortDirections';

export function toString(value) {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }

    return String(value);
}

export function toStringBoolean(value) {
    return toString(!!value);
}

export function toStringContact(value, contacts) {
    return getContactTitle(contacts.find(contact => contact.id === value));
}

export function toStringObject(value, objects) {
    const object = objects.find(contact => contact.id === value);
    return object ? object.title : '';
}

export function toStringDate(value, format) {
    if (!value) {
        return '';
    }

    return moment(value).format(format);
}

export function toStringDuration(value) {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }

    const days = Math.floor(value / 86400);
    const hours = Math.floor((value % 86400) / 3600);
    const minutes = Math.floor(((value % 86400) % 3600) / 60);

    let str = '';

    str += days.toString().padStart(2, '0') + 'd ';
    str += hours.toString().padStart(2, '0') + 'h';
    str += minutes.toString().padStart(2, '0') + 'm';

    return str.trim();
}

export function toStringArray(value) {
    if (!value) {
        return '';
    }

    return value.join(', ');
}

export function toStringNumber(value, prefix = '', suffix = '') {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }

    return prefix + value + suffix;
}

export function toStringSortDirection(value) {
    const sortDirection = getSortDirections().find(sortDirection => sortDirection.id === value);
    return sortDirection ? sortDirection.title : '';
}

export function toStringPassword(value) {
    return value.replace(/./g, '*');
}

export function toStringPriority(value) {
    const priority = getPriority(value);
    return priority ? priority.title : '';
}

export function toStringRepeat(value, extended = false) {
    if (!value || typeof value !== 'string') {
        return extended ? 'Do not repeat' : '';
    }

    if (value === 'PARENT') {
        return 'with parent';
    }

    let str = '';

    if (value.includes(';FROMCOMP')) {
        value = value.replace(';FROMCOMP', '');
        str += ' from completion date';
    } else {
        str += ' from due date';
    }

    if (value.includes(';FASTFORWARD')) {
        value = value.replace(';FASTFORWARD', '');
        str += ' (fast forward)';
    }

    try {
        return RRule.fromString(value).toText() + (extended ? str : '');
    } catch (error) {
        return extended ? 'Do not repeat' : '';
    }
}

export function toStringStatus(value) {
    const status = getStatuses().find(status => status.id === value);
    return status ? status.title : '';
}

export function toStringTimer(timer) {
    if (!timer) {
        return '';
    }

    let value = timer.value || 0;

    if (timer.startDate) {
        value = value + moment().diff(moment(timer.startDate), 'seconds');
    }

    return toStringDuration(value);
}

export function toStringGoalLevel(value) {
    const goalLevel = getGoalLevel(value);
    return goalLevel ? goalLevel.title : '';
}