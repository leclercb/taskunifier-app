import React from 'react';
import PropTypes from 'prop-types';
import { TaskStatusPropType } from '../../proptypes/TaskStatusPropTypes';
import withTaskStatus from '../../containers/WithTaskStatus';
import withSettings from '../../containers/WithSettings';
import Icon from '../common/Icon';
import { getTaskStatusColor } from '../../utils/SettingUtils';

export function TaskStatusTitle(props) {
    const taskStatus = props.taskStatus;
    return taskStatus ? (
        <Icon icon="circle" color={getTaskStatusColor(taskStatus.id, props.settings)} text={taskStatus.title} />
    ) : (<span>&nbsp;</span>);
}

TaskStatusTitle.propTypes = {
    taskStatusId: PropTypes.string,
    taskStatus: TaskStatusPropType
}

export default withTaskStatus(withSettings(TaskStatusTitle));