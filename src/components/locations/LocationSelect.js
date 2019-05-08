import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { LocationPropType } from 'proptypes/LocationPropTypes';
import withLocations from 'containers/WithLocations';
import Icon from 'components/common/Icon';

function LocationSelect(props, ref) {
    const { locations, ...restProps } = props;

    restProps.value = props.locations.find(location => location.id === restProps.value) ? restProps.value : null;

    return (
        <Select ref={ref} allowClear={true} {...restProps}>
            {locations.map(location => (
                <Select.Option key={location.id} value={location.id}>
                    <Icon icon="circle" color={location.color} text={location.title} />
                </Select.Option>
            ))}
        </Select>
    );
};

LocationSelect.propTypes = {
    locations: PropTypes.arrayOf(LocationPropType.isRequired).isRequired
};

const FRLocationSelect = React.forwardRef(LocationSelect);

export { FRLocationSelect as LocationSelect };
export default withLocations(FRLocationSelect);