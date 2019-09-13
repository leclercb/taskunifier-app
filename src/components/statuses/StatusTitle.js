import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { getStatusColor } from 'utils/SettingUtils';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useStatusApi } from 'hooks/UseStatusApi';

export function StatusTitle(props) {
    const settingsApi = useSettingsApi();
    const statusApi = useStatusApi();
    const status = statusApi.statuses.find(status => status.id === props.statusId);

    return status ? (
        <Icon icon="circle" color={getStatusColor(status.id, settingsApi.settings)} text={status.title} />
    ) : (<span>&nbsp;</span>);
}

StatusTitle.propTypes = {
    statusId: PropTypes.string
};

export default StatusTitle;