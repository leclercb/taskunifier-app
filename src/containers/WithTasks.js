import { connect } from 'react-redux';
import { addTask, deleteTask, setSelectedTaskIds, setSelectedTaskFilter, updateTask } from 'actions/TaskActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { merge } from 'utils/ObjectUtils';

function withTasks(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true,
        applySelectedTaskFilter: false
    }, options || {});

    const mapStateToProps = state => {
        let tasks = state.tasks.filteredByVisibleState;

        if (options.applySelectedTaskFilter === true) {
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
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withTasks;