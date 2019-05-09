import { connect } from 'react-redux';
import {
    addTask,
    deleteTask,
    setSelectedTaskFilter,
    setSelectedTaskIds,
    updateTask
} from 'actions/TaskActions';
import withBusyCheck from 'containers/WithBusyCheck';
import {
    getSelectedTaskFilter,
    getSelectedTaskIds
} from 'selectors/AppSelectors';
import {
    getTasksFilteredBySelectedFilter,
    getTasksFilteredByVisibleState
} from 'selectors/TaskSelectors';
import { merge } from 'utils/ObjectUtils';

function withTasks(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true,
        applySelectedTaskFilter: false
    }, options || {});

    const mapStateToProps = state => {
        let tasks = getTasksFilteredByVisibleState(state);

        if (options.applySelectedTaskFilter === true) {
            tasks = getTasksFilteredBySelectedFilter(state);
        }

        return {
            tasks: tasks,
            selectedTaskIds: getSelectedTaskIds(state),
            selectedTaskFilter: getSelectedTaskFilter(state)
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