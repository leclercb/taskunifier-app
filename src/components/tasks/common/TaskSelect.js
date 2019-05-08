import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import withTasks from 'containers/WithTasks';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { getImportanceColor, getPriorityColor } from 'utils/SettingUtils';

export function TaskSelect(props) {
    const { tasks, ...restProps } = props;

    restProps.value = props.tasks.find(task => task.id === restProps.value) ? restProps.value : null;

    return (
        <Select allowClear={true} {...restProps}>
            {tasks.map(task => (
                <Select.Option key={task.id} value={task.id}>
                    <Icon
                        icon="circle"
                        color={getPriorityColor(task.priority, props.settings)}
                        text={task.title}
                        globalStyle={{
                            backgroundColor: getImportanceColor(task.importance, props.settings),
                            borderRadius: 4,
                            padding: '2px 8px'
                        }} />
                </Select.Option>
            ))}
        </Select>
    );
};

TaskSelect.propTypes = {
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    settings: PropTypes.object.isRequired
};

export default withSettings(withTasks(TaskSelect));