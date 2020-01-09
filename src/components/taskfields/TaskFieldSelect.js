import React, { forwardRef } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';

const TaskFieldSelect = forwardRef(function TaskFieldSelect(props, ref) {
    const taskFieldApi = useTaskFieldApi();
    const value = taskFieldApi.taskFields.find(taskField => taskField.id === props.value) ? props.value : undefined;

    return (
        <Select
            ref={ref}
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) => (option.props.title || '').toLowerCase().includes(input)}
            {...props}
            value={value}>
            {taskFieldApi.taskFields.map(taskField => (
                <Select.Option key={taskField.id} value={taskField.id} title={taskField.title}>
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