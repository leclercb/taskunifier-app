import React from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { getGoalLevels } from 'data/DataGoalLevels';

export const GoalLevelSelect = React.forwardRef(function GoalLevelSelect(props, ref) {
    return (
        <Select ref={ref} allowClear={true} {...props}>
            {getGoalLevels().map(level => (
                <Select.Option key={level.id} value={level.id}>
                    <Icon icon="circle" color={level.color} text={level.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

GoalLevelSelect.displayName = 'ForwardRefGoalLevelSelect';

export default GoalLevelSelect;