import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getImportanceColor, getPriorityColor } from 'utils/SettingUtils';

export const TaskSelect = React.forwardRef(function TaskSelect(props, ref) {
    const tasks = useSelector(getTasksFilteredByVisibleState);
    const value = tasks.find(task => task.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
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
});

TaskSelect.displayName = 'ForwardRefTaskSelect';

TaskSelect.propTypes = {
    value: PropTypes.string,
    settings: SettingsPropType.isRequired
};

export default withSettings(TaskSelect);