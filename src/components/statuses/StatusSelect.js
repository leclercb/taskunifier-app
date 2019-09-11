import React from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { useSettings } from 'hooks/UseSettings';
import { useStatuses } from 'hooks/UseStatuses';
import { getStatusColor } from 'utils/SettingUtils';

export const StatusSelect = React.forwardRef(function StatusSelect(props, ref) {
    const settingsApi = useSettings();
    const statusApi = useStatuses();

    return (
        <Select ref={ref} allowClear={true} {...props}>
            {statusApi.statuses.map(status => (
                <Select.Option key={status.id} value={status.id}>
                    <Icon icon="circle" color={getStatusColor(status.id, settingsApi.settings)} text={status.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

StatusSelect.displayName = 'ForwardRefStatusSelect';

export default StatusSelect;