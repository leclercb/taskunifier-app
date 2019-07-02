import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { getGoalLevel } from 'data/DataGoalLevels';

export function GoalLevelTitle({ goalLevelId }) {
    const goalLevel = getGoalLevel(goalLevelId);
    return goalLevel ? <Icon icon="circle" color={goalLevel.color} text={goalLevel.title} /> : <span>&nbsp;</span>;
}

GoalLevelTitle.propTypes = {
    goalLevelId: PropTypes.string
};

export default GoalLevelTitle;