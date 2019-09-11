import React from 'react';
import PropTypes from 'prop-types';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { getStatusColor } from 'utils/SettingUtils';
import { useStatuses } from 'hooks/UseStatuses';

export function StatusTitle(props) {
    const statusApi = useStatuses();
    const status = statusApi.statuses.find(status => status.id === props.statusId);

    return status ? (
        <Icon icon="circle" color={getStatusColor(status.id, props.settings)} text={status.title} />
    ) : (<span>&nbsp;</span>);
}

StatusTitle.propTypes = {
    statusId: PropTypes.string,
    settings: SettingsPropType.isRequired
};

export default withSettings(StatusTitle);