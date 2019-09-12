import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVisibleLocationSelector } from 'selectors/LocationSelectors';

export function useLocation(locationId) {
    const getVisibleLocation = useMemo(getVisibleLocationSelector, []);
    const location = useSelector(state => getVisibleLocation(state, locationId));
    return location;
}