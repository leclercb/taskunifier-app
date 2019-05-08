import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { StatusPropType } from 'proptypes/StatusPropTypes';
import withStatuses from 'containers/WithStatuses';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { getStatusColor } from 'utils/SettingUtils';

export function StatusSelect(props) {
    const { statuses, ...restProps } = props;

    return (
        <Select allowClear={true} {...restProps}>
            {statuses.map(status => (
                <Select.Option key={status.id} value={status.id}>
                    <Icon icon="circle" color={getStatusColor(status.id, props.settings)} text={status.title} />
                </Select.Option>
            ))}
        </Select>
    );
};

StatusSelect.propTypes = {
    statuses: PropTypes.arrayOf(StatusPropType.isRequired).isRequired,
    settings: PropTypes.object.isRequired
};

export default withSettings(withStatuses(StatusSelect));