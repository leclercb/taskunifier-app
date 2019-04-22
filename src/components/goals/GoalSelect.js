import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { GoalPropType } from '../../proptypes/GoalPropTypes';
import withGoals from '../../containers/WithGoals';
import Icon from '../common/Icon';

export const GoalSelect = React.forwardRef(function GoalSelect(props, ref) {
    const { goals, ...restProps } = props;

    restProps.value = props.goals.find(goal => goal.id === restProps.value) ? restProps.value : null;

    return (
        <Select ref={ref} allowClear={true} {...restProps}>
            {goals.map(goal => (
                <Select.Option key={goal.id} value={goal.id}>
                    <Icon icon="circle" color={goal.color} text={goal.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

GoalSelect.propTypes = {
    goals: PropTypes.arrayOf(GoalPropType).isRequired
}

export default withGoals(GoalSelect, { filterArchived: true });