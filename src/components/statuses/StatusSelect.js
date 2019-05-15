import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import withStatuses from 'containers/WithStatuses';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { StatusPropType } from 'proptypes/StatusPropTypes';
import { getStatusColor } from 'utils/SettingUtils';

export const StatusSelect = React.forwardRef(function StatusSelect(props, ref) {
    const { statuses, ...restProps } = props;

    return (
        <Select ref={ref} allowClear={true} {...restProps}>
            {statuses.map(status => (
                <Select.Option key={status.id} value={status.id}>
                    <Icon icon="circle" color={getStatusColor(status.id, props.settings)} text={status.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

StatusSelect.propTypes = {
    statuses: PropTypes.arrayOf(StatusPropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired
};

export default withSettings(withStatuses(StatusSelect));