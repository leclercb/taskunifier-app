export function findParents(o, objects) {
    const parent = o.parent ? objects.find(object => object.id === o.parent) : null;

    if (!parent) {
        return [];
    }

    const parents = [];
    parents.push(parent);
    parents.push(...findParents(parent, objects));

    return parents;
}

export function hasChildren(o, objects) {
    return !!objects.find(object => object.parent === o.id);
}