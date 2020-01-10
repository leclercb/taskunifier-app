import React, { forwardRef } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';

const TaskTemplateSelect = forwardRef(function TaskTemplateSelect(props, ref) {
    const taskTemplateApi = useTaskTemplateApi();
    const value = taskTemplateApi.taskTemplates.find(taskTemplate => taskTemplate.id === props.value) ? props.value : undefined;

    return (
        <Select
            ref={ref}
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) => (option.props.title || '').toLowerCase().includes(input)}
            {...props}
            value={value}>
            {taskTemplateApi.taskTemplates.map(taskTemplate => (
                <Select.Option key={taskTemplate.id} value={taskTemplate.id} title={taskTemplate.title}>
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