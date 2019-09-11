import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getVisibleGoal } from 'selectors/GoalSelectors';

export function GoalTitle(props) {
    const goal = useSelector(state => getVisibleGoal(state, props.goalId));
    return goal ? <Icon icon="circle" color={goal.color} text={goal.title} /> : <span>&nbsp;</span>;
}

GoalTitle.propTypes = {
    goalId: PropTypes.string
};

export default GoalTitle;