import React from 'react';
import PropTypes from 'prop-types';
import { PriorityPropType } from '../../proptypes/PriorityPropTypes';
import withPriority from '../../containers/WithPriority';
import Icon from '../common/Icon';

export function PriorityTitle(props) {
    const priority = props.priority;
    return priority ? <Icon icon="circle" color={priority.color} text={priority.title} /> : <span>&nbsp;</span>;
}

PriorityTitle.propTypes = {
    priorityId: PropTypes.string,
    priority: PriorityPropType
}

export default withPriority(PriorityTitle);