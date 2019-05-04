import { connect } from 'react-redux';
import { addTaskFilter, deleteTaskFilter, updateTaskFilter } from 'actions/TaskFilterActions';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withTaskFilters(Component) {
    const mapStateToProps = state => ({
        taskFilters: filterObjects(state.taskFilters.all)
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