import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useTaskField } from 'hooks/UseTaskField';

export function TaskFieldTitle(props) {
    const taskField = useTaskField(props.taskFieldId);
    return taskField ? <Icon icon="circle" color={taskField.color} text={taskField.title} /> : <span>&nbsp;</span>;
}

TaskFieldTitle.propTypes = {
    taskFieldId: PropTypes.string
};

export default TaskFieldTitle;