import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadLocationsFromFile(file) {
    return loadObjectsFromFile('locations', file);
};

export function saveLocationsToFile(file, data) {
    return saveObjectsToFile('locations', file, data);
};

export function setLocations(locations) {
    return setObjects('locations', locations);
};

export function addLocation(location) {
    return addObject('locations', location);
};

export function updateLocation(location) {
    return updateObject('locations', location);
};

export function deleteLocation(locationId) {
    return deleteObject('locations', locationId);
};

export function cleanLocations() {
    return cleanObjects('locations');
};