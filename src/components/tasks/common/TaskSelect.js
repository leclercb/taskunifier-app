import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { getImportanceColor, getPriorityColor } from 'utils/SettingUtils';
import { useTaskApi } from 'hooks/UseTaskApi';

export const TaskSelect = React.forwardRef(function TaskSelect(props, ref) {
    const settingsApi = useSettingsApi();
    const taskApi = useTaskApi();
    const value = taskApi.tasks.find(task => task.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {taskApi.tasks.map(task => (
                <Select.Option key={task.id} value={task.id}>
                    <Icon
                        icon="circle"
                        color={getPriorityColor(task.priority, settingsApi.settings)}
                        text={task.title}
                        globalStyle={{
                            backgroundColor: getImportanceColor(task.importance, settingsApi.settings),
                            borderRadius: 4,
                            padding: '2px 8px'
                        }} />
                </Select.Option>
            ))}
        </Select>
    );
});

TaskSelect.displayName = 'ForwardRefTaskSelect';

TaskSelect.propTypes = {
    value: PropTypes.string
};

export default TaskSelect;