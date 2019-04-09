import React from 'react';
import { connect } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../actions/TaskActions';
import { filterObjects } from '../reducers/Objects';

const mapStateToProps = state => ({
    tasks: filterObjects(state.tasks)
});

const mapDispatchToProps = dispatch => ({
    addTask: task => dispatch(addTask(task)),
    updateTask: task => dispatch(updateTask(task)),
    deleteTask: taskId => dispatch(deleteTask(taskId))
});

function withTasks(Component) {
    function WithTasks(props) {
        return <Component {...props} />
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithTasks);
}

export default withTasks;