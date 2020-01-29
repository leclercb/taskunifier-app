import { getConditionsFieldTypeForType } from 'data/DataFieldFilterTypes';
import { getObjectsForFieldType } from 'data/DataFieldTypes';

export function getObjectRemoteValue(state, fieldType, value) {
    const objects = getObjectsForFieldType(state, fieldType);

    if (!objects) {
        return value;
    }

    const object = objects.find(object => object.id === value);

    return object ? object.refIds.taskunifier : null;
}

export function getObjectLocalValue(state, fieldType, value) {
    const objects = getObjectsForFieldType(state, fieldType);

    if (!objects) {
        return value;
    }

    const object = objects.find(object => object.refIds.taskunifier === value);

    return object ? object.id : null;
}

export function convertFieldsToRemote(fields, state, object) {
    return fields.reduce((newObject, field) => {
        const remoteId = field.static ? field.id : field.refIds.taskunifier;

        if (field.id in newObject) {
            newObject[remoteId] = getObjectRemoteValue(state, field.type, newObject[field.id]);

            if (!field.static) {
                delete newObject[field.id];
            }
        }

        return newObject;
    }, { ...object });
}

export function convertFieldsToLocal(fields, state, object) {
    return fields.reduce((newObject, field) => {
        const remoteId = field.static ? field.id : field.refIds.taskunifier;

        if (remoteId in newObject) {
            newObject[field.id] = getObjectLocalValue(state, field.type, newObject[remoteId]);

            if (!field.static) {
                delete newObject[remoteId];
            }
        }

        return newObject;
    }, { ...object });
}

export function convertLinkedContactsToRemote(linkedContacts, state) {
    if (!linkedContacts) {
        return linkedContacts;
    }

    return linkedContacts.map(linkedContact => {
        return {
            ...linkedContact,
            contact: getObjectRemoteValue(state, 'contact', linkedContact.contact)
        };
    });
}

export function convertLinkedContactsToLocal(linkedContacts, state) {
    if (!linkedContacts) {
        return linkedContacts;
    }

    return linkedContacts.map(linkedContact => {
        return {
            ...linkedContact,
            contact: getObjectLocalValue(state, 'contact', linkedContact.contact)
        };
    });
}

export function convertLinkedTasksToRemote(linkedTasks, state) {
    if (!linkedTasks) {
        return linkedTasks;
    }

    return linkedTasks.map(linkedTask => {
        return {
            ...linkedTask,
            task: getObjectRemoteValue(state, 'task', linkedTask.task)
        };
    });
}

export function convertLinkedTasksToLocal(linkedTasks, state) {
    if (!linkedTasks) {
        return linkedTasks;
    }

    return linkedTasks.map(linkedTask => {
        return {
            ...linkedTask,
            task: getObjectLocalValue(state, 'task', linkedTask.task)
        };
    });
}

export function convertConditionToRemote(condition, state) {
    if (!condition) {
        return condition;
    }

    if (condition.operator) {
        if (condition.conditions) {
            return {
                ...condition,
                conditions: condition.conditions.map(c => convertConditionToRemote(c, state))
            };
        }
    }

    return {
        ...condition,
        value: getObjectRemoteValue(state, getConditionsFieldTypeForType(condition.field), condition.value)
    };
}

export function convertConditionToLocal(condition, state) {
    if (!condition) {
        return condition;
    }

    if (condition.operator) {
        if (condition.conditions) {
            return {
                ...condition,
                conditions: condition.conditions.map(c => convertConditionToLocal(c, state))
            };
        }
    }

    return {
        ...condition,
        value: getObjectLocalValue(state, getConditionsFieldTypeForType(condition.field), condition.value)
    };
}