import { connect } from 'react-redux';
import { addTaskFilter, deleteTaskFilter, updateTaskFilter } from 'actions/TaskFilterActions';
import withBusyCheck from 'containers/WithBusyCheck';

function withTaskFilters(Component) {
    const mapStateToProps = state => ({
        taskFilters: state.taskFilters.filteredByVisibleState
    });

    const mapDispatchToProps = dispatch => ({
        addTaskFilter: taskFilter => dispatch(addTaskFilter(taskFilter)),
        updateTaskFilter: taskFilter => dispatch(updateTaskFilter(taskFilter)),
        deleteTaskFilter: taskFilterId => dispatch(deleteTaskFilter(taskFilterId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withTaskFilters;