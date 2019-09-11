import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { useSettings } from 'hooks/UseSettings';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getImportanceColor, getPriorityColor } from 'utils/SettingUtils';

export const TaskSelect = React.forwardRef(function TaskSelect(props, ref) {
    const settingsApi = useSettings();
    const tasks = useSelector(getTasksFilteredByVisibleState);
    const value = tasks.find(task => task.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {tasks.map(task => (
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