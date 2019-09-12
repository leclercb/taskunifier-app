import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { getPriorityColor } from 'utils/SettingUtils';
import { usePriorities } from 'hooks/UsePriorities';
import { useSettings } from 'hooks/UseSettings';

export function PriorityTitle(props) {
    const priorityApi = usePriorities();
    const settingsApi = useSettings();

    const priority = priorityApi.priorities.find(priority => priority.id === props.priorityId);

    return priority ? (
        <Icon icon="circle" color={getPriorityColor(priority.id, settingsApi.settings)} text={priority.title} />
    ) : (<span>&nbsp;</span>);
}

PriorityTitle.propTypes = {
    priorityId: PropTypes.string
};

export default PriorityTitle;