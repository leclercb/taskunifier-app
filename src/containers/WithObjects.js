import { connect } from 'react-redux';
import { filterArchivedObjects, filterObjects } from 'utils/CategoryUtils';
import { addContext, deleteContext, updateContext } from 'actions/ContextActions';
import { addNoteFilter, deleteNoteFilter, updateNoteFilter } from 'actions/NoteFilterActions';
import { addTaskFilter, deleteTaskFilter, updateTaskFilter } from 'actions/TaskFilterActions';
import { addFolder, deleteFolder, updateFolder } from 'actions/FolderActions';
import { addGoal, deleteGoal, updateGoal } from 'actions/GoalActions';
import { addLocation, deleteLocation, updateLocation } from 'actions/LocationActions';
import { deleteTag, updateTag } from 'actions/TagActions';
import { addTaskTemplate, deleteTaskTemplate, updateTaskTemplate } from 'actions/TaskTemplateActions';
import { getTagsFromObjects } from 'utils/TagUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withObjects(Component, options = {
    includeActions: false,
    includeContexts: false,
    includeFolders: false,
    includeGoals: false,
    includeLocations: false,
    includeTags: false,
    includeTaskTemplates: false,
    includeNoteFilters: false,
    includeTaskFilters: false,
    filterArchivedFolders: false,
    filterArchivedGoals: false
}) {
    const mapStateToProps = state => {
        const data = {};

        if (options && options.includeContexts === true) {
            data.contexts = filterObjects(state.contexts.all);
        }

        if (options && options.includeFolders === true) {
            data.folders = filterObjects(state.folders.all);

            if (options.filterArchivedFolders === true) {
                data.folders = filterArchivedObjects(data.folders);
            }
        }

        if (options && options.includeGoals === true) {
            data.goals = filterObjects(state.goals.all);

            if (options.filterArchivedGoals === true) {
                data.goals = filterArchivedObjects(data.goals);
            }
        }

        if (options && options.includeLocations === true) {
            data.locations = filterObjects(state.locations.all);
        }

        if (options && options.includeTags === true) {
            data.tags = getTagsFromObjects(filterObjects(state.tasks.all).concat(filterObjects(state.notes.all)));
        }

        if (options && options.includeTaskTemplates === true) {
            data.taskTemplates = filterObjects(state.taskTemplates.all);
        }

        if (options && options.includeNoteFilters === true) {
            data.noteFilters = filterObjects(state.noteFilters.all);
        }

        if (options && options.includeTaskFilters === true) {
            data.taskFilters = filterObjects(state.taskFilters.all);
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
            addFolder: folder => dispatch(addFolder(folder)),
            updateFolder: folder => dispatch(updateFolder(folder)),
            deleteFolder: folderId => dispatch(deleteFolder(folderId)),
            addGoal: goal => dispatch(addGoal(goal)),
            updateGoal: goal => dispatch(updateGoal(goal)),
            deleteGoal: goalId => dispatch(deleteGoal(goalId)),
            addLocation: location => dispatch(addLocation(location)),
            updateLocation: location => dispatch(updateLocation(location)),
            deleteLocation: locationId => dispatch(deleteLocation(locationId)),
            updateTag: (tagId, newTagId) => dispatch(updateTag(tagId, newTagId)),
            deleteTag: tagId => dispatch(deleteTag(tagId)),
            addTaskTemplate: taskTemplate => dispatch(addTaskTemplate(taskTemplate)),
            updateTaskTemplate: taskTemplate => dispatch(updateTaskTemplate(taskTemplate)),
            deleteTaskTemplate: taskTemplateId => dispatch(deleteTaskTemplate(taskTemplateId)),
            addNoteFilter: noteFilter => dispatch(addNoteFilter(noteFilter)),
            updateNoteFilter: noteFilter => dispatch(updateNoteFilter(noteFilter)),
            deleteNoteFilter: noteFilterId => dispatch(deleteNoteFilter(noteFilterId)),
            addTaskFilter: taskFilter => dispatch(addTaskFilter(taskFilter)),
            updateTaskFilter: taskFilter => dispatch(updateTaskFilter(taskFilter)),
            deleteTaskFilter: taskFilterId => dispatch(deleteTaskFilter(taskFilterId))
        };
    };

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withObjects;