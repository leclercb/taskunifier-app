import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { TaskStatusPropType } from '../../proptypes/TaskStatusPropTypes';
import withTaskStatuses from '../../containers/WithTaskStatuses';
import withSettings from '../../containers/WithSettings';
import Icon from '../common/Icon';
import { getTaskStatusColor } from '../../utils/SettingUtils';

function TaskStatusSelect(props) {
    const { taskStatuses, ...restProps } = props;

    return (
        <Select allowClear={true} {...restProps}>
            {taskStatuses.map(taskStatus => (
                <Select.Option key={taskStatus.id} value={taskStatus.id}>
                    <Icon icon="circle" color={getTaskStatusColor(taskStatus.id, props.settings)} text={taskStatus.title} />
                </Select.Option>
            ))}
        </Select>
    );
}

TaskStatusSelect.propTypes = {
    taskStatuses: PropTypes.arrayOf(TaskStatusPropType).isRequired
}

export default withTaskStatuses(withSettings(TaskStatusSelect));