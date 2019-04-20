import React from 'react';
import { connect } from 'react-redux';
import { addTaskFilter, updateTaskFilter, deleteTaskFilter } from '../actions/TaskFilterActions';
import { filterObjects } from '../utils/CategoryUtils';

function withTaskFilters(Component) {
    function WithTaskFilters(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
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
    )(WithTaskFilters);
}

export default withTaskFilters;