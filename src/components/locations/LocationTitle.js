import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getVisibleLocation } from 'selectors/LocationSelectors';

export function LocationTitle(props) {
    const location = useSelector(getVisibleLocation(props.locationId));
    return location ? <Icon icon="circle" color={location.color} text={location.title} /> : <span>&nbsp;</span>;
}

LocationTitle.propTypes = {
    locationId: PropTypes.string
};

export default LocationTitle;