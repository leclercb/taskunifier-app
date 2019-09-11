import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getTaskFieldsFilteredByVisibleState } from 'selectors/TaskFieldSelectors';

export const TaskFieldSelect = React.forwardRef(function TaskFieldSelect(props, ref) {
    const taskFields = useSelector(getTaskFieldsFilteredByVisibleState);
    const value = taskFields.find(taskField => taskField.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {taskFields.map(taskField => (
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