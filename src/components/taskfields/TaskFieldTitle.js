import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getVisibleTaskField } from 'selectors/TaskFieldSelectors';

export function TaskFieldTitle(props) {
    const taskField = useSelector(state => getVisibleTaskField(state, props.taskFieldId));
    return taskField ? <Icon icon="circle" color={taskField.color} text={taskField.title} /> : <span>&nbsp;</span>;
}

TaskFieldTitle.propTypes = {
    taskFieldId: PropTypes.string
};

export default TaskFieldTitle;