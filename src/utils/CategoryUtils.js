export function filterObjects(objects) {
    return objects.filter(object => object.state === 'LOADED' || object.state === 'TO_UPDATE');
}

export function filterArchivedObjects(objects) {
    return objects.filter(object => !object.archived);
}

export function filterStaticObjects(objects) {
    return objects.filter(object => !object.static);
}