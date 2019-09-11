import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getVisibleTaskTemplate } from 'selectors/TaskTemplateSelectors';

export function TaskTemplateTitle(props) {
    const taskTemplate = useSelector(state => getVisibleTaskTemplate(state, props.taskTemplateId));
    return taskTemplate ? <Icon icon="circle" color={taskTemplate.color} text={taskTemplate.title} /> : <span>&nbsp;</span>;
}

TaskTemplateTitle.propTypes = {
    taskTemplateId: PropTypes.string
};

export default TaskTemplateTitle;