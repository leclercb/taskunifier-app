import React from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { usePriorityApi } from 'hooks/UsePriorityApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { getPriorityColor } from 'utils/SettingUtils';

export const PrioritySelect = React.forwardRef(function PrioritySelect(props, ref) {
    const priorityApi = usePriorityApi();
    const settingsApi = useSettingsApi();

    return (
        <Select ref={ref} allowClear={true} {...props}>
            {priorityApi.priorities.map(priority => (
                <Select.Option key={priority.id} value={priority.id}>
                    <Icon icon="circle" color={getPriorityColor(priority.id, settingsApi.settings)} text={priority.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

PrioritySelect.displayName = 'ForwardRefPrioritySelect';

export default PrioritySelect;