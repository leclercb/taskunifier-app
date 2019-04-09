export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
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