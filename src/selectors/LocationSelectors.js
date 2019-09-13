import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';

export const getLocations = state => state.locations;

export const getLocationsFilteredByVisibleState = createSelector(
    getLocations,
    (locations) => {
        return filterByVisibleState(locations).sort((a, b) => compareStrings(a.title, b.title));
    }
);

export const getVisibleLocationSelector = () => createSelector(
    getLocationsFilteredByVisibleState,
    (state, id) => id,
    (locations, id) => {
        return locations.find(location => location.id === id);
    }
);