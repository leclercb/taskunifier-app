import moment from 'moment';
import { getContactTitle } from 'utils/ContactUtils';
import { getPriorities } from 'data/DataPriorities';
import { getStatuses } from 'data/DataStatuses';

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

export function toStringLength(value) {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }

    const minutes = Math.floor(value / 60).toString().padStart(2, '0');
    const seconds = (value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
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

export function toStringPriority(value) {
    const priority = getPriorities().find(priority => priority.id === value);
    return priority ? priority.title : '';
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

    return toStringLength(value);
}