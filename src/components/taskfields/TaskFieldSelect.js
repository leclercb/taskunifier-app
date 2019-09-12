import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useTaskFields } from 'hooks/UseTaskFields';

export const TaskFieldSelect = React.forwardRef(function TaskFieldSelect(props, ref) {
    const taskFieldApi = useTaskFields();
    const value = taskFieldApi.taskFields.find(taskField => taskField.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {taskFieldApi.taskFields.map(taskField => (
                <Select.Option key={taskField.id} value={taskField.id}>
                    <Icon icon="circle" color={taskField.color} text={taskField.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

TaskFieldSelect.displayName = 'ForwardRefTaskFieldSelect';

TaskFieldSelect.propTypes = {
    value: PropTypes.string
};

export default TaskFieldSelect;