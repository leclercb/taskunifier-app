import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useLocation } from 'hooks/UseLocation';

export function LocationTitle(props) {
    const location = useLocation(props.locationId);
    return location ? <Icon icon="circle" color={location.color} text={location.title} /> : <span>&nbsp;</span>;
}

LocationTitle.propTypes = {
    locationId: PropTypes.string
};

export default LocationTitle;