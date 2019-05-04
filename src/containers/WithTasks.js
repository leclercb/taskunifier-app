import { connect } from 'react-redux';
import { addTask, deleteTask, setSelectedTaskIds, updateTask } from 'actions/TaskActions';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withTasks(Component, options = { applySelectedTaskFilter: false, actionsOnly: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        let tasks = filterObjects(state.tasks.all);

        if (options && options.applySelectedTaskFilter === true) {
            tasks = state.tasks.filtered;
        }

        return {
            tasks: tasks,
            selectedTaskIds: state.tasks.selectedTaskIds,
            selectedTaskFilter: state.tasks.selectedTaskFilter
        };
    };

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

export default withTasks;