import React, { forwardRef } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import withBusyCheck from 'containers/WithBusyCheck';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { getImportanceColor, getPriorityColor } from 'utils/SettingUtils';

const TaskSelect = forwardRef(function TaskSelect({ apis, value, ...props }, ref) {
    const { settingsApi, taskApi } = apis;
    const v = taskApi.tasks.find(task => task.id === value) ? value : undefined;

    return (
        <Select
            ref={ref}
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) => (option.props.title || '').toLowerCase().includes(input)}
            {...props}
            value={v}>
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
    apis: PropTypes.object.isRequired,
    value: PropTypes.string
};

export default withBusyCheck(TaskSelect, () => ({
    settingsApi: useSettingsApi(),
    taskApi: useTaskApi()
}));