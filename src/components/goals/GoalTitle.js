import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useGoal } from 'hooks/UseGoal';

export function GoalTitle(props) {
    const goal = useGoal(props.goalId);
    return goal ? <Icon icon="circle" color={goal.color} text={goal.title} /> : <span>&nbsp;</span>;
}

GoalTitle.propTypes = {
    goalId: PropTypes.string
};

export default GoalTitle;