import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';

export const GoalSelect = React.forwardRef(function GoalSelect(props, ref) {
    const goals = useSelector(getGoalsFilteredByVisibleState);
    const value = goals.find(goal => goal.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {goals.map(goal => (
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