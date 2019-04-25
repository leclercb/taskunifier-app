import React from 'react';
import PropTypes from 'prop-types';
import { StatusPropType } from 'proptypes/StatusPropTypes';
import withStatus from 'containers/WithStatus';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { getStatusColor } from 'utils/SettingUtils';

export function StatusTitle(props) {
    const status = props.status;
    return status ? (
        <Icon icon="circle" color={getStatusColor(status.id, props.settings)} text={status.title} />
    ) : (<span>&nbsp;</span>);
}

StatusTitle.propTypes = {
    statusId: PropTypes.string,
    status: StatusPropType,
    settings: PropTypes.object.isRequired
};

export default withStatus(withSettings(StatusTitle));