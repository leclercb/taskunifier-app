import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';

export const TaskTemplateSelect = React.forwardRef(function TaskTemplateSelect(props, ref) {
    const taskTemplateApi = useTaskTemplateApi();
    const value = taskTemplateApi.taskTemplates.find(taskTemplate => taskTemplate.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {taskTemplateApi.taskTemplates.map(taskTemplate => (
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