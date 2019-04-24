import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export const loadLocationsFromFile = file => {
    return loadObjectsFromFile('locations', file);
};

export const saveLocationsToFile = (file, data) => {
    return saveObjectsToFile('locations', file, data);
};

export const setLocations = locations => {
    return setObjects('locations', locations);
};

export const addLocation = location => {
    return addObject('locations', location);
};

export const updateLocation = location => {
    return updateObject('locations', location);
};

export const deleteLocation = locationId => {
    return deleteObject('locations', locationId);
};

export const cleanLocations = () => {
    return cleanObjects('locations');
};