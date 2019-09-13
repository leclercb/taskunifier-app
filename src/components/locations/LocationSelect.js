import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useLocationApi } from 'hooks/UseLocationApi';

export const LocationSelect = React.forwardRef(function LocationSelect(props, ref) {
    const locationApi = useLocationApi();
    const value = locationApi.locations.find(location => location.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {locationApi.locations.map(location => (
                <Select.Option key={location.id} value={location.id}>
                    <Icon icon="circle" color={location.color} text={location.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

LocationSelect.displayName = 'ForwardRefLocationSelect';

LocationSelect.propTypes = {
    value: PropTypes.string
};

export default LocationSelect;