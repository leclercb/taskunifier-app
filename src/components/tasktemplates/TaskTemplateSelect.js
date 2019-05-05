import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { TaskTemplatePropType } from 'proptypes/TaskTemplatePropTypes';
import withTaskTemplates from 'containers/WithTaskTemplates';
import Icon from 'components/common/Icon';

export const TaskTemplateSelect = React.forwardRef(function TaskTemplateSelect(props, ref) {
    const { taskTemplates, ...restProps } = props;

    restProps.value = props.taskTemplates.find(taskTemplate => taskTemplate.id === restProps.value) ? restProps.value : null;

    return (
        <Select ref={ref} allowClear={true} {...restProps}>
            {taskTemplates.map(taskTemplate => (
                <Select.Option key={taskTemplate.id} value={taskTemplate.id}>
                    <Icon icon="circle" color={taskTemplate.color} text={taskTemplate.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

TaskTemplateSelect.propTypes = {
    taskTemplates: PropTypes.arrayOf(TaskTemplatePropType.isRequired).isRequired
};

export default withTaskTemplates(TaskTemplateSelect);