import React from 'react';
import { connect } from 'react-redux';
import { addTaskField, updateTaskField, deleteTaskField } from '../actions/TaskFieldActions';
import { getDefaultTaskFields } from '../data/DataTaskFields';
import { filterObjects } from '../utils/CategoryUtils';

function withTaskFields(Component) {
    function WithTaskFields(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        taskFields: getDefaultTaskFields(state.settings).concat(filterObjects(state.taskFields))
    });

    const mapDispatchToProps = dispatch => ({
        addTaskField: field => dispatch(addTaskField(field)),
        updateTaskField: field => dispatch(updateTaskField(field)),
        deleteTaskField: fieldId => dispatch(deleteTaskField(fieldId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithTaskFields);
}

export default withTaskFields;