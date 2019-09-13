import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { getPriorityColor } from 'utils/SettingUtils';
import { usePriorityApi } from 'hooks/UsePriorityApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';

export function PriorityTitle(props) {
    const priorityApi = usePriorityApi();
    const settingsApi = useSettingsApi();

    const priority = priorityApi.priorities.find(priority => priority.id === props.priorityId);

    return priority ? (
        <Icon icon="circle" color={getPriorityColor(priority.id, settingsApi.settings)} text={priority.title} />
    ) : (<span>&nbsp;</span>);
}

PriorityTitle.propTypes = {
    priorityId: PropTypes.string
};

export default PriorityTitle;