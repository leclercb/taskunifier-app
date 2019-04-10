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