import React from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useStatusApi } from 'hooks/UseStatusApi';
import { getStatusColor } from 'utils/SettingUtils';

export const StatusSelect = React.forwardRef(function StatusSelect(props, ref) {
    const settingsApi = useSettingsApi();
    const statusApi = useStatusApi();

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