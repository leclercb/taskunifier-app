import { connect } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../actions/TaskActions';
import { filterObjects } from '../utils/CategoryUtils';
import { setSelectedTaskIds } from '../actions/AppActions';
import withBusyCheck from '../components/common/WithBusyCheck';

function withSelectedTasks(Component) {
    const mapStateToProps = state => ({
        busy: state.processes.busy,
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
    )(withBusyCheck(Component));
}

export default withSelectedTasks;