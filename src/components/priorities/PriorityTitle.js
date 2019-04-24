import React from 'react';
import PropTypes from 'prop-types';
import { PriorityPropType } from 'proptypes/PriorityPropTypes';
import withPriority from 'containers/WithPriority';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { getPriorityColor } from 'utils/SettingUtils';

export function PriorityTitle(props) {
    const priority = props.priority;
    return priority ? (
        <Icon icon="circle" color={getPriorityColor(priority.id, props.settings)} text={priority.title} />
    ) : (<span>&nbsp;</span>);
}

PriorityTitle.propTypes = {
    priorityId: PropTypes.string,
    priority: PriorityPropType
};

export default withPriority(withSettings(PriorityTitle));