export function filterByVisibleState(objects) {
    return objects.filter(object => object.state === 'LOADED' || object.state === 'TO_UPDATE');
}

export function filterByNonArchived(objects) {
    return objects.filter(object => !object.archived);
}

export function filterByStatic(objects) {
    return objects.filter(object => !object.static);
}