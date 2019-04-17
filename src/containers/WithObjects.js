import React from 'react';
import { connect } from 'react-redux';
import { filterObjects, filterArchivedObjects } from '../utils/CategoryUtils';
import { addContext, updateContext, deleteContext } from '../actions/ContextActions';
import { addFilter, updateFilter, deleteFilter } from '../actions/FilterActions';
import { addFolder, updateFolder, deleteFolder } from '../actions/FolderActions';
import { addGoal, updateGoal, deleteGoal } from '../actions/GoalActions';
import { addLocation, updateLocation, deleteLocation } from '../actions/LocationActions';
import { addTaskTemplate, updateTaskTemplate, deleteTaskTemplate } from '../actions/TaskTemplateActions';

function withObjects(Component, options = {
    includeActions: false,
    includeContexts: false,
    includeFilters: false,
    includeFolders: false,
    includeGoals: false,
    includeLocations: false,
    includeTaskTemplates: false,
    filterArchivedFolders: false,
    filterArchivedGoals: false
}) {
    function WithObjects(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => {
        const data = {};

        if (options && options.includeContexts === true) {
            data.contexts = filterObjects(state.contexts);
        }

        if (options && options.includeFilters === true) {
            data.filters = filterObjects(state.filters);
        }

        if (options && options.includeFolders === true) {
            data.folders = filterObjects(state.folders);

            if (options.filterArchivedFolders === true) {
                data.folders = filterArchivedObjects(data.folders);
            }
        }

        if (options && options.includeGoals === true) {
            data.goals = filterObjects(state.goals);

            if (options.filterArchivedGoals === true) {
                data.goals = filterArchivedObjects(data.goals);
            }
        }

        if (options && options.includeLocations === true) {
            data.locations = filterObjects(state.locations);
        }

        if (options && options.includeTaskTemplates === true) {
            data.taskTemplates = filterObjects(state.taskTemplates);
        }

        return data;
    };

    const mapDispatchToProps = dispatch => {
        if (!options || options.includeActions !== true) {
            return {};
        }

        return {
            addContext: context => dispatch(addContext(context)),
            updateContext: context => dispatch(updateContext(context)),
            deleteContext: contextId => dispatch(deleteContext(contextId)),
            addFilter: field => dispatch(addFilter(field)),
            updateFilter: field => dispatch(updateFilter(field)),
            deleteFilter: fieldId => dispatch(deleteFilter(fieldId)),
            addFolder: folder => dispatch(addFolder(folder)),
            updateFolder: folder => dispatch(updateFolder(folder)),
            deleteFolder: folderId => dispatch(deleteFolder(folderId)),
            addGoal: goal => dispatch(addGoal(goal)),
            updateGoal: goal => dispatch(updateGoal(goal)),
            deleteGoal: goalId => dispatch(deleteGoal(goalId)),
            addLocation: location => dispatch(addLocation(location)),
            updateLocation: location => dispatch(updateLocation(location)),
            deleteLocation: locationId => dispatch(deleteLocation(locationId)),
            addTaskTemplate: taskTemplate => dispatch(addTaskTemplate(taskTemplate)),
            updateTaskTemplate: taskTemplate => dispatch(updateTaskTemplate(taskTemplate)),
            deleteTaskTemplate: taskTemplateId => dispatch(deleteTaskTemplate(taskTemplateId))
        }
    };

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithObjects);
}

export default withObjects;