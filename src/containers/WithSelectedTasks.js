import React from 'react';
import { connect } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../actions/TaskActions';
import { filterObjects } from '../utils/CategoryUtils';
import { setSelectedTaskIds } from '../actions/AppActions';

function withSelectedTasks(Component) {
    function WithSelectedTasks(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        selectedTaskIds: state.app.selectedTaskIds,
        selectedTasks: filterObjects(state.tasks.filter(task => state.app.selectedTaskIds.includes(task.id)))
    });

    const mapDispatchToProps = dispatch => ({
        addTask: task => dispatch(addTask(task)),
        updateTask: task => dispatch(updateTask(task)),
        deleteTask: taskId => dispatch(deleteTask(taskId)),
        setSelectedTaskIds: taskIds => dispatch(setSelectedTaskIds(taskIds))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithSelectedTasks);
}

export default withSelectedTasks;