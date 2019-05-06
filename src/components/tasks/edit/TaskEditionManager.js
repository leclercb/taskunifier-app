import React from 'react';
import PropTypes from 'prop-types';
import TaskEditionForm from 'components/tasks/edit/TaskEditionForm';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskEditionManager(props) {
    return (
        <TaskEditionForm form={props.form} task={props.task} />
    );
}

TaskEditionManager.propTypes = {
    form: PropTypes.object.isRequired,
    task: TaskPropType.isRequired
};

export default TaskEditionManager;