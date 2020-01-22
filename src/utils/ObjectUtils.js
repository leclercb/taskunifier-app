import { isEqual, transform } from 'lodash';

export function shallowEquals(objectA, objectB) {
    for (let key in objectA) {
        if (!(key in objectB) || objectA[key] !== objectB[key]) {
            return false;
        }
    }

    for (let key in objectB) {
        if (!(key in objectA)) {
            return false;
        }
    }

    return true;
}

export function equals(object1, object2) {
    return JSON.stringify(object1) === JSON.stringify(object2);
}

export function isPureObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function clone(o) {
    if (o === undefined || o === null || typeof o !== 'object') {
        return o;
    }

    const output = Array.isArray(o) ? [] : {};

    for (let key in o) {
        const v = o[key];
        output[key] = (typeof v === 'object') ? clone(v) : v;
    }

    return output;
}

export function merge(target, source) {
    if (!isPureObject(source) || !isPureObject(target)) {
        return source;
    }

    const output = Object.assign({}, target);

    Object.keys(source).forEach(key => {
        if (isPureObject(source[key])) {
            if (!(key in target)) {
                Object.assign(output, { [key]: source[key] });
            } else {
                output[key] = merge(target[key], source[key]);
            }
        } else {
            Object.assign(output, { [key]: source[key] });
        }
    });

    return output;
}

export function getValue(object, path, safe = false) {
    try {
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');

        let keys = path.split('.');
        for (let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            if (key in object) {
                object = object[key];
            } else {
                return;
            }
        }
    } catch (e) {
        if (safe === true) {
            return undefined;
        } else {
            throw e;
        }
    }

    return object;
}

export function setValue(object, path, value, safe = false) {
    try {
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');

        let keys = path.split('.');
        for (let i = 0; i < keys.length - 1; ++i) {
            let key = keys[i];
            if (key in object) {
                object = object[key];
            } else {
                object[key] = {};
                object = object[key];
            }
        }

        object[keys[keys.length - 1]] = value;
    } catch (e) {
        if (safe === true) {
            return;
        } else {
            throw e;
        }
    }
}

export function diff(object, base) {
    return transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
            result[key] = value;
        }
    });
}

export function removePrivateKeys(object) {
    Object.keys(object).forEach(key => {
        if (key.startsWith('_')) {
            delete object[key];
        }
    });
}