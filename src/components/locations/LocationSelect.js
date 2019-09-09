import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import withLocations from 'containers/WithLocations';
import { LocationPropType } from 'proptypes/LocationPropTypes';

export const LocationSelect = React.forwardRef(function LocationSelect(props, ref) {
    const { locations, ...restProps } = props;

    restProps.value = locations.find(location => location.id === restProps.value) ? restProps.value : null;

    return (
        <Select ref={ref} allowClear={true} {...restProps}>
            {locations.map(location => (
                <Select.Option key={location.id} value={location.id}>
                    <Icon icon="circle" color={location.color} text={location.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

LocationSelect.displayName = 'ForwardRefLocationSelect';

LocationSelect.propTypes = {
    locations: PropTypes.arrayOf(LocationPropType.isRequired).isRequired
};

export default withLocations(LocationSelect);