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

export function findChildren(o, objects) {
    const directChildren = objects.filter(object => object.parent === o.id);
    const children = [...directChildren];

    directChildren.forEach(child => {
        children.push(...findChildren(child, objects));
    });

    return children;
}

export function hasChildren(o, objects) {
    return !!objects.find(object => object.parent === o.id);
}

export function getSubLevel(o, objectsMetaData) {
    const metaData = objectsMetaData.find(metaData => metaData.id === o.id);
    return metaData ? metaData.parents.length : 0;
}