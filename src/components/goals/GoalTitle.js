import React from 'react';
import PropTypes from 'prop-types';
import { GoalPropType } from '../../proptypes/GoalPropTypes';
import withGoal from '../../containers/WithGoal';
import Icon from '../common/Icon';

function GoalTitle(props) {
    const goal = props.goal;
    return goal ? <Icon icon="circle" color={goal.color} text={goal.title} /> : <span>&nbsp;</span>;
}

GoalTitle.propTypes = {
    goalId: PropTypes.string.isRequired,
    goal: GoalPropType
}

export default withGoal(GoalTitle);