import React from 'react';
import PropTypes from 'prop-types';
import withPriority from 'containers/WithPriority';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { PriorityPropType } from 'proptypes/PriorityPropTypes';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { getPriorityColor } from 'utils/SettingUtils';

export function PriorityTitle(props) {
    const { priority } = props;
    return priority ? (
        <Icon icon="circle" color={getPriorityColor(priority.id, props.settings)} text={priority.title} />
    ) : (<span>&nbsp;</span>);
}

PriorityTitle.propTypes = {
    priorityId: PropTypes.string,
    priority: PriorityPropType,
    settings: SettingsPropType.isRequired
};

export default withPriority(withSettings(PriorityTitle));