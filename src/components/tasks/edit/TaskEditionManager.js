import React from 'react';
import PropTypes from 'prop-types';
import TaskEditionForm from 'components/tasks/edit/TaskEditionForm';
import withTask from 'containers/WithTask';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskEditionManager(props) {
    return (
        <TaskEditionForm task={props.task} updateTask={props.updateTask} />
    );
}

TaskEditionManager.propTypes = {
    task: TaskPropType.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default withTask(TaskEditionManager);