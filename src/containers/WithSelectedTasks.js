import { connect } from 'react-redux';
import { addTask, deleteTask, setSelectedTaskIds, updateTask } from 'actions/TaskActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getSelectedTaskIds } from 'selectors/AppSelectors';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';

function withSelectedTasks(Component) {
    const mapStateToProps = state => ({
        selectedTaskIds: getSelectedTaskIds(state),
        selectedTasks: getTasksFilteredByVisibleState(state).filter(task => getSelectedTaskIds(state).includes(task.id))
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
    )(withBusyCheck(Component));
}

export default withSelectedTasks;