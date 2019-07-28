import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile, 
    saveObjectsToServer, 
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

export function saveLocationsToServer(data) {
    return saveObjectsToServer('locations', data);
}

export function setLocations(locations) {
    return setObjects('locations', locations);
}

export function addLocation(location, options = {}) {
    return addObject('locations', location, options);
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