import moment from 'moment';
import { getCompareForType } from 'data/DataFieldTypes';
import { getGoalLevelIndex } from 'data/DataGoalLevels';
import { getPriorityIndex } from 'data/DataPriorities';
import { getSortDirectionIndex } from 'data/DataSortDirections';
import { getStatuses } from 'data/DataStatuses';
import { getContactTitle } from 'utils/ContactUtils';
import { toStringRepeat } from 'utils/StringUtils';

export function compareBooleans(a, b) {
    const boolA = a ? true : false;
    const boolB = b ? true : false;
    return boolB - boolA;
}

export function compareContacts(a, b, contacts) {
    const objectA = contacts.find(contact => contact.id === a);
    const objectB = contacts.find(contact => contact.id === b);

    return compareStrings(getContactTitle(objectA), getContactTitle(objectB));
}

export function compareDates(a, b, useTime) {
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
}

export function compareNumbers(a, b) {
    const numA = a ? a : 0;
    const numB = b ? b : 0;
    return numB - numA;
}

export function compareObjects(a, b, objects) {
    const objectA = objects.find(object => object.id === a);
    const objectB = objects.find(object => object.id === b);

    return compareStrings(objectA ? objectA.title : '', objectB ? objectB.title : '');
}

export function compareObjectsHierarchy(field, a, b, state, getMetaDataFunction, indented) {
    if (indented) {
        return compareObjectsIndented(field, a, b, state, getMetaDataFunction);
    } else {
        return compareObjectsUnindented(field, a, b, state);
    }
}

export function compareObjectsIndented(field, a, b, state, getMetaDataFunction) {
    const valueA = a[field.id];
    const valueB = b[field.id];

    const parentsA = [...getMetaDataFunction(state).find(meta => meta.id === a.id).parents].reverse();
    const parentsB = [...getMetaDataFunction(state).find(meta => meta.id === b.id).parents].reverse();

    let result = 0;

    if (parentsA.length === 0 && parentsB.length === 0) {
        result = getCompareForType(field.type, valueA, valueB, state);
    } else if (a.parent === b.parent) {
        result = getCompareForType(field.type, valueA, valueB, state);
    } else if (parentsA.includes(b)) {
        result = 1;
    } else if (parentsB.includes(a)) {
        result = -1;
    } else {
        parentsA.push(a);
        parentsB.push(b);

        for (let i = 0; i < Math.max(parentsA.length, parentsB.length); i++) {
            if (i < parentsA.length) {
                a = parentsA[i];
            }

            if (i < parentsB.length) {
                b = parentsB[i];
            }

            if (a === b) {
                continue;
            }

            result = getCompareForType(field.type, a[field.id], b[field.id], state);

            break;
        }
    }

    return result;
}

export function compareObjectsUnindented(field, a, b, state) {
    const valueA = a[field.id];
    const valueB = b[field.id];

    return getCompareForType(field.type, valueA, valueB, state);
}

export function compareSortDirections(a, b) {
    return getSortDirectionIndex(b) - getSortDirectionIndex(a);
}

export function comparePriorities(a, b) {
    return getPriorityIndex(b) - getPriorityIndex(a);
}

export function compareRepeats(a, b) {
    return compareStrings(toStringRepeat(a), toStringRepeat(b));
}

export function compareStatuses(a, b) {
    return compareObjects(a, b, getStatuses());
}

export function compareGoalLevels(a, b) {
    return getGoalLevelIndex(b) - getGoalLevelIndex(a);
}

export function compareStrings(a, b) {
    return (a || '').localeCompare((b || ''), undefined, { sensitivity: 'base' });
}

export function compareVersions(a, b) {
    const matchA = a.match(/^([0-9]+)\.([0-9]+)\.([0-9]+).*$/);
    const matchB = b.match(/^([0-9]+)\.([0-9]+)\.([0-9]+).*$/);

    if (!matchA && !matchB) {
        return 0;
    }

    if (!matchA) {
        return 1;
    }

    if (!matchB) {
        return -1;
    }

    for (let i = 0; i < 3; i++) {
        const nbA = Number.parseInt(matchA[i]);
        const nbB = Number.parseInt(matchB[i]);
        const result = compareNumbers(nbA, nbB);

        if (result !== 0) {
            return result;
        }
    }

    return 0;
}