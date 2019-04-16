import React from 'react';
import { connect } from 'react-redux';
import { addTaskTemplate, updateTaskTemplate, deleteTaskTemplate } from '../actions/TaskTemplateActions';
import { filterObjects } from '../utils/CategoryUtils';

function withTaskTemplates(Component) {
    function WithTaskTemplates(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        taskTemplates: filterObjects(state.taskTemplates)
    });

    const mapDispatchToProps = dispatch => ({
        addTaskTemplate: taskTemplate => dispatch(addTaskTemplate(taskTemplate)),
        updateTaskTemplate: taskTemplate => dispatch(updateTaskTemplate(taskTemplate)),
        deleteTaskTemplate: taskTemplateId => dispatch(deleteTaskTemplate(taskTemplateId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithTaskTemplates);
}

export default withTaskTemplates;