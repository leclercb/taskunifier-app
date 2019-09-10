import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    duplicateObject,
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile,
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadLocationsFromFile(file) {
    return loadObjectsFromFile('locations', file);
}

export function saveLocationsToFile(file, data) {
    return saveObjectsToFile('locations', file, data);
}

export function loadLocationsFromServer() {
    return loadObjectsFromServer('locations');
}

export function setLocations(locations) {
    return setObjects('locations', locations);
}

export function addLocation(location, options = {}) {
    return addObject('locations', location, options);
}

export function duplicateLocation(location, options = {}) {
    return duplicateObject('locations', location, options);
}

export function updateLocation(location, options = {}) {
    return updateObject('locations', location, options);
}

export function deleteLocation(locationId, options = {}) {
    return deleteObject('locations', locationId, options);
}

export function cleanLocations() {
    return cleanObjects('locations');
}