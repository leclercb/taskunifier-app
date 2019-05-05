import moment from 'moment';
import { getContactTitle } from 'utils/ContactUtils';
import { getPriorityIndex } from 'data/DataPriorities';
import { getStatuses } from 'data/DataStatuses';
import { formatRepeat } from 'utils/RepeatUtils';

export const compareBooleans = (a, b) => {
    const boolA = a ? true : false;
    const boolB = b ? true : false;
    return boolB - boolA;
};

export const compareContacts = (contacts, a, b) => {
    const objectA = contacts.find(contact => contact.id === a);
    const objectB = contacts.find(contact => contact.id === b);

    return compareStrings(getContactTitle(objectA), getContactTitle(objectB));
};

export const compareDates = (a, b, useTime) => {
    if (a === b) {
        return 0;
    }

    if (!a) {
        return 1;
    }

    if (!b) {
        return -1;
    }

    return moment(b).diff(moment(a), useTime ? 'seconds' : 'days');
};

export const compareNumbers = (a, b) => {
    const numA = a ? a : 0;
    const numB = b ? b : 0;
    return numB - numA;
};

export const compareObjects = (objects, a, b) => {
    const objectA = objects.find(object => object.id === a);
    const objectB = objects.find(object => object.id === b);

    return compareStrings(objectA ? objectA.title : '', objectB ? objectB.title : '');
};

export const comparePriorities = (a, b) => {
    return getPriorityIndex(b) - getPriorityIndex(a);
};

export const compareRepeats = (a, b) => {
    return compareStrings(formatRepeat(a), formatRepeat(b));
};

export const compareStatuses = (a, b) => {
    return compareObjects(getStatuses(), a, b);
};

export const compareStrings = (a, b) => {
    return (a || '').localeCompare((b || ''), undefined, { sensitivity: 'base' });
};