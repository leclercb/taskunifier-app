import { connect } from 'react-redux';
import { addTaskFilter, updateTaskFilter, deleteTaskFilter } from '../actions/TaskFilterActions';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withTaskFilters(Component) {
    const mapStateToProps = state => ({
        busy: state.processes.busy,
        taskFilters: filterObjects(state.taskFilters)
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