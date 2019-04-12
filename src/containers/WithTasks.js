import React from 'react';
import { connect } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../actions/TaskActions';
import { filterObjects } from '../utils/CategoryUtils';
import { applyFilter } from '../utils/FilterUtils';

function withTasks(Component, options = { applySelectedFilter: false }) {
    function WithTasks(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => {
        let tasks = filterObjects(state.tasks);

        if (options && options.applySelectedFilter === true) {
            tasks = applyFilter(state.app.selectedFilter, tasks, state.fields);
        }

        return {
            tasks: tasks
        };
    };

    const mapDispatchToProps = dispatch => ({
        addTask: task => dispatch(addTask(task)),
        updateTask: task => dispatch(updateTask(task)),
        deleteTask: taskId => dispatch(deleteTask(taskId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithTasks);
}

export default withTasks;