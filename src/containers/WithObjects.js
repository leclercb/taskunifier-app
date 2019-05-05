import { connect } from 'react-redux';
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
import { setSelectedNoteIds, setSelectedNoteFilter } from 'actions/NoteActions';
import { setSelectedTaskIds, setSelectedTaskFilter } from 'actions/TaskActions';

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
    includeSelectedNoteFilter: false,
    includeSelectedTaskFilter: false,
    includeNoteNumber: false,
    includeTaskNumber: false,
    filterArchivedFolders: false,
    filterArchivedGoals: false
}) {
    const mapStateToProps = state => {
        const data = {};

        if (options && options.includeContexts === true) {
            data.contexts = state.contexts.filteredByVisibleState;
        }

        if (options && options.includeFolders === true) {
            data.folders = state.folders.filteredByVisibleState;

            if (options.filterArchivedFolders === true) {
                //data.folders = data.folders.filteredByNonArchived;
            }
        }

        if (options && options.includeGoals === true) {
            data.goals = state.goals.filteredByVisibleState;

            if (options.filterArchivedGoals === true) {
                //data.goals = data.goals.filteredByNonArchived;
            }
        }

        if (options && options.includeLocations === true) {
            data.locations = state.locations.filteredByVisibleState;
        }

        if (options && options.includeTags === true) {
            data.tags = getTagsFromObjects(state.tasks.filteredByVisibleState.concat(state.notes.filteredByVisibleState));
        }

        if (options && options.includeTaskTemplates === true) {
            data.taskTemplates = state.taskTemplates.filteredByVisibleState;
        }

        if (options && options.includeNoteFilters === true) {
            data.noteFilters = state.noteFilters.filteredByVisibleState;
        }

        if (options && options.includeTaskFilters === true) {
            data.taskFilters = state.taskFilters.filteredByVisibleState;
        }

        if (options && options.includeSelectedNoteFilter === true) {
            data.selectedNoteFilter = state.notes.selectedNoteFilter;
        }

        if (options && options.includeSelectedTaskFilter === true) {
            data.selectedTaskFilter = state.tasks.selectedTaskFilter;
        }

        if (options && options.includeNoteNumber === true) {
            data.noteNumber = state.notes.filteredBySelectedFilter.length;
        }

        if (options && options.includeTaskNumber === true) {
            data.taskNumber = state.tasks.filteredBySelectedFilter.length;
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
            updateTag: tag => dispatch(updateTag(tag)),
            deleteTag: tagId => dispatch(deleteTag(tagId)),
            addTaskTemplate: taskTemplate => dispatch(addTaskTemplate(taskTemplate)),
            updateTaskTemplate: taskTemplate => dispatch(updateTaskTemplate(taskTemplate)),
            deleteTaskTemplate: taskTemplateId => dispatch(deleteTaskTemplate(taskTemplateId)),
            addNoteFilter: noteFilter => dispatch(addNoteFilter(noteFilter)),
            updateNoteFilter: noteFilter => dispatch(updateNoteFilter(noteFilter)),
            deleteNoteFilter: noteFilterId => dispatch(deleteNoteFilter(noteFilterId)),
            addTaskFilter: taskFilter => dispatch(addTaskFilter(taskFilter)),
            updateTaskFilter: taskFilter => dispatch(updateTaskFilter(taskFilter)),
            deleteTaskFilter: taskFilterId => dispatch(deleteTaskFilter(taskFilterId)),
            setSelectedNoteIds: noteIds => dispatch(setSelectedNoteIds(noteIds)),
            setSelectedNoteFilter: noteFilter => dispatch(setSelectedNoteFilter(noteFilter)),
            setSelectedTaskIds: taskIds => dispatch(setSelectedTaskIds(taskIds)),
            setSelectedTaskFilter: taskFilter => dispatch(setSelectedTaskFilter(taskFilter))
        };
    };

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withObjects;