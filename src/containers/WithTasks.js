import { connect } from 'react-redux';
import { addTask, deleteTask, setSelectedTaskIds, setSelectedTaskFilter, updateTask } from 'actions/TaskActions';
import withBusyCheck from 'containers/WithBusyCheck';

function withTasks(Component, options = { applySelectedTaskFilter: false, actionsOnly: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        let tasks = state.tasks.filteredByVisibleState;

        if (options && options.applySelectedTaskFilter === true) {
            tasks = state.tasks.filteredBySelectedFilter;
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
        setSelectedTaskIds: taskIds => dispatch(setSelectedTaskIds(taskIds)),
        setSelectedTaskFilter: taskFilter => dispatch(setSelectedTaskFilter(taskFilter))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withTasks;