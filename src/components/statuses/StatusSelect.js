import React from 'react';
import { Select } from 'antd';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { useStatuses } from 'hooks/UseStatuses';
import { getStatusColor } from 'utils/SettingUtils';

export const StatusSelect = React.forwardRef(function StatusSelect(props, ref) {
    const statusApi = useStatuses();

    return (
        <Select ref={ref} allowClear={true} {...props}>
            {statusApi.statuses.map(status => (
                <Select.Option key={status.id} value={status.id}>
                    <Icon icon="circle" color={getStatusColor(status.id, props.settings)} text={status.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

StatusSelect.displayName = 'ForwardRefStatusSelect';

StatusSelect.propTypes = {
    settings: SettingsPropType.isRequired
};

export default withSettings(StatusSelect);