import React from 'react';
import { connect } from 'react-redux';
import { addTaskTemplate, updateTaskTemplate, deleteTaskTemplate } from '../actions/TaskTemplateActions';
import { filterObjects } from '../utils/CategoryUtils';
import { applyFilter } from '../utils/FilterUtils';

function withTaskTemplates(Component, options = { applySelectedFilter: false }) {
    function WithTaskTemplates(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => {
        let taskTemplates = filterObjects(state.taskTemplates);

        if (options && options.applySelectedFilter === true) {
            taskTemplates = applyFilter(state.app.selectedFilter, taskTemplates, state.fields);
        }

        return {
            taskTemplates: taskTemplates
        };
    };

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