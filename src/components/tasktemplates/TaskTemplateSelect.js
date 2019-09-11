import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getTaskTemplatesFilteredByVisibleState } from 'selectors/TaskTemplateSelectors';

export const TaskTemplateSelect = React.forwardRef(function TaskTemplateSelect(props, ref) {
    const taskTemplates = useSelector(getTaskTemplatesFilteredByVisibleState);
    const value = taskTemplates.find(taskTemplate => taskTemplate.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {taskTemplates.map(taskTemplate => (
                <Select.Option key={taskTemplate.id} value={taskTemplate.id}>
                    <Icon icon="circle" color={taskTemplate.color} text={taskTemplate.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

TaskTemplateSelect.displayName = 'ForwardRefTaskTemplateSelect';

TaskTemplateSelect.propTypes = {
    value: PropTypes.string
};

export default TaskTemplateSelect;