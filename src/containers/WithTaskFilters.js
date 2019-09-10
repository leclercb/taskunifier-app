import { connect } from 'react-redux';
import { addTaskFilter, deleteTaskFilter, duplicateTaskFilter, updateTaskFilter } from 'actions/TaskFilterActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getTaskFiltersFilteredByVisibleState } from 'selectors/TaskFilterSelectors';

function withTaskFilters(Component) {
    const mapStateToProps = state => ({
        taskFilters: getTaskFiltersFilteredByVisibleState(state)
    });

    const mapDispatchToProps = dispatch => ({
        addTaskFilter: taskFilter => dispatch(addTaskFilter(taskFilter)),
        duplicateTaskFilter: taskFilter => dispatch(duplicateTaskFilter(taskFilter)),
        updateTaskFilter: taskFilter => dispatch(updateTaskFilter(taskFilter)),
        deleteTaskFilter: taskFilterId => dispatch(deleteTaskFilter(taskFilterId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withTaskFilters;