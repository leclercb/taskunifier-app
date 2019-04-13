import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { LocationPropType } from '../../proptypes/LocationPropTypes';
import withLocations from '../../containers/WithLocations';
import Icon from '../common/Icon';

function LocationSelect(props) {
    const { locations, ...restProps } = props;

    return (
        <Select {...restProps}>
            {locations.map(location => (
                <Select.Option key={location.id} value={location.id}>
                    <Icon icon="circle" color={location.color} text={location.title} />
                </Select.Option>
            ))}
        </Select>
    );
}

LocationSelect.propTypes = {
    locations: PropTypes.arrayOf(LocationPropType).isRequired
}

export default withLocations(LocationSelect);