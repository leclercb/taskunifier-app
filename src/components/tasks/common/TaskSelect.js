import React, { forwardRef } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { getImportanceColor, getPriorityColor } from 'utils/SettingUtils';
import { useTaskApi } from 'hooks/UseTaskApi';

const TaskSelect = forwardRef(function TaskSelect(props, ref) {
    const settingsApi = useSettingsApi();
    const taskApi = useTaskApi();
    const value = taskApi.tasks.find(task => task.id === props.value) ? props.value : undefined;

    return (
        <Select
            ref={ref}
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) => (option.props.title || '').toLowerCase().includes(input)}
            {...props}
            value={value}>
            {taskApi.tasks.map(task => (
                <Select.Option key={task.id} value={task.id} title={task.title}>
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