import React from 'react';
import PropTypes from 'prop-types';
import { LocationPropType } from '../../proptypes/LocationPropTypes';
import withLocation from '../../containers/WithLocation';
import Icon from '../common/Icon';

export function LocationTitle(props) {
    const location = props.location;
    return location ? <Icon icon="circle" color={location.color} text={location.title} /> : <span>&nbsp;</span>;
}

LocationTitle.propTypes = {
    locationId: PropTypes.string,
    location: LocationPropType
};

export default withLocation(LocationTitle);