import React from 'react';
import { Select } from 'antd';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { usePriorities } from 'hooks/UsePriorities';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { getPriorityColor } from 'utils/SettingUtils';

export const PrioritySelect = React.forwardRef(function PrioritySelect(props, ref) {
    const priorityApi = usePriorities();

    return (
        <Select ref={ref} allowClear={true} {...props}>
            {priorityApi.priorities.map(priority => (
                <Select.Option key={priority.id} value={priority.id}>
                    <Icon icon="circle" color={getPriorityColor(priority.id, props.settings)} text={priority.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

PrioritySelect.displayName = 'ForwardRefPrioritySelect';

PrioritySelect.propTypes = {
    settings: SettingsPropType.isRequired
};

export default withSettings(PrioritySelect);