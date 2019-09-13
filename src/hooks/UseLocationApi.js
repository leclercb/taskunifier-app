import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLocation, deleteLocation, duplicateLocation, updateLocation } from 'actions/LocationActions';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';

export function useLocationApi() {
    const dispatch = useDispatch();
    const locations = useSelector(getLocationsFilteredByVisibleState);

    const addLocationCallback = useCallback(
        location => dispatch(addLocation(location)),
        [dispatch]
    );

    const duplicateLocationCallback = useCallback(
        location => dispatch(duplicateLocation(location)),
        [dispatch]
    );

    const updateLocationCallback = useCallback(
        location => dispatch(updateLocation(location)),
        [dispatch]
    );

    const deleteLocationCallback = useCallback(
        locationId => dispatch(deleteLocation(locationId)),
        [dispatch]
    );

    return {
        locations,
        addLocation: addLocationCallback,
        duplicateLocation: duplicateLocationCallback,
        updateLocation: updateLocationCallback,
        deleteLocation: deleteLocationCallback
    };
}