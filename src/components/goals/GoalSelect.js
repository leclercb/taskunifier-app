import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useGoalApi } from 'hooks/UseGoalApi';

export const GoalSelect = React.forwardRef(function GoalSelect(props, ref) {
    const goalApi = useGoalApi();
    const value = goalApi.goals.find(goal => goal.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {goalApi.goals.map(goal => (
                <Select.Option key={goal.id} value={goal.id}>
                    <Icon icon="circle" color={goal.color} text={goal.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

GoalSelect.displayName = 'ForwardRefGoalSelect';

GoalSelect.propTypes = {
    value: PropTypes.string
};

export default GoalSelect;