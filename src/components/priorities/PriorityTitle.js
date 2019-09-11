import React from 'react';
import PropTypes from 'prop-types';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { getPriorityColor } from 'utils/SettingUtils';
import { usePriorities } from 'hooks/UsePriorities';

export function PriorityTitle(props) {
    const priorityApi = usePriorities();
    const priority = priorityApi.priorities.find(priority => priority.id === props.priorityId);

    return priority ? (
        <Icon icon="circle" color={getPriorityColor(priority.id, props.settings)} text={priority.title} />
    ) : (<span>&nbsp;</span>);
}

PriorityTitle.propTypes = {
    priorityId: PropTypes.string,
    settings: SettingsPropType.isRequired
};

export default withSettings(PriorityTitle);