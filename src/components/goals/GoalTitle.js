import React from 'react';
import PropTypes from 'prop-types';
import { GoalPropType } from 'proptypes/GoalPropTypes';
import withGoal from 'containers/WithGoal';
import Icon from 'components/common/Icon';

export function GoalTitle(props) {
    const { goal } = props;
    return goal ? <Icon icon="circle" color={goal.color} text={goal.title} /> : <span>&nbsp;</span>;
}

GoalTitle.propTypes = {
    goalId: PropTypes.string,
    goal: GoalPropType
};

export default withGoal(GoalTitle);