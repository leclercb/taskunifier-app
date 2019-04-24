import React from 'react';
import PropTypes from 'prop-types';
import { TaskTemplatePropType } from '../../proptypes/TaskTemplatePropTypes';
import withTaskTemplate from 'containers/WithTaskTemplate';
import Icon from '../common/Icon';

export function TaskTemplateTitle(props) {
    const taskTemplate = props.taskTemplate;
    return taskTemplate ? <Icon icon="circle" color={taskTemplate.color} text={taskTemplate.title} /> : <span>&nbsp;</span>;
}

TaskTemplateTitle.propTypes = {
    taskTemplateId: PropTypes.string,
    taskTemplate: TaskTemplatePropType
};

export default withTaskTemplate(TaskTemplateTitle);