import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useTaskTemplate } from 'hooks/UseTaskTemplate';

export function TaskTemplateTitle(props) {
    const taskTemplate = useTaskTemplate(props.taskTemplateId);
    return taskTemplate ? <Icon icon="circle" color={taskTemplate.color} text={taskTemplate.title} /> : <span>&nbsp;</span>;
}

TaskTemplateTitle.propTypes = {
    taskTemplateId: PropTypes.string
};

export default TaskTemplateTitle;