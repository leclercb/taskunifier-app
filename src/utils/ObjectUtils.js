import uuid from 'uuid';

export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function clone(o) {
    if (o === undefined || o === null) {
        return o;
    }

    const output = Array.isArray(o) ? [] : {};

    for (let key in o) {
        const v = o[key];
        output[key] = (typeof v === "object") ? clone(v) : v;
    }

    return output;
}

export function merge(target, source) {
    if (!isObject(source) || !isObject(target)) {
        return source;
    }

    const output = Object.assign({}, target);

    Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
            if (!(key in target)) {
                Object.assign(output, { [key]: source[key] });
            } else {
                output[key] = merge(target[key], source[key]);
            }
        } else {
            Object.assign(output, { [key]: source[key] });
        }
    })

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

export function generateUniqueIds(object, key) {
    if (object && typeof object === 'object') {
        if (!Array.isArray(object)) {
            object[key] = uuid();
        }

        for (let k in object) {
            generateUniqueIds(object[k], key);
        }
    }
}