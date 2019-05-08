import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';

export const getLocations = state => state.locations;

export const getLocationsFilteredByVisibleState = createSelector(
    [getLocations],
    (locations) => {
        return filterByVisibleState(locations);
    }
);