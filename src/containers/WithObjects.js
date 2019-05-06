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
import { merge } from 'utils/ObjectUtils';

function withObjects(Component, options) {
    options = merge({
        includeDispatch: false,
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
        filteredByNonArchivedFolders: false,
        filteredByNonArchivedGoals: false
    }, options || {});

    const mapStateToProps = state => {
        const data = {};

        if (options.includeContexts === true) {
            data.contexts = state.contexts.filteredByVisibleState;
        }

        if (options.includeFolders === true) {
            data.folders = state.folders.filteredByVisibleState;

            if (options.filteredByNonArchivedFolders === true) {
                data.folders = state.folders.filteredByNonArchived;
            }
        }

        if (options.includeGoals === true) {
            data.goals = state.goals.filteredByVisibleState;

            if (options.filteredByNonArchivedGoals === true) {
                data.goals = state.goals.filteredByNonArchived;
            }
        }

        if (options.includeLocations === true) {
            data.locations = state.locations.filteredByVisibleState;
        }

        if (options.includeTags === true) {
            data.tags = getTagsFromObjects(state.tasks.filteredByVisibleState.concat(state.notes.filteredByVisibleState));
        }

        if (options.includeTaskTemplates === true) {
            data.taskTemplates = state.taskTemplates.filteredByVisibleState;
        }

        if (options.includeNoteFilters === true) {
            data.noteFilters = state.noteFilters.filteredByVisibleState;
        }

        if (options.includeTaskFilters === true) {
            data.taskFilters = state.taskFilters.filteredByVisibleState;
        }

        if (options.includeSelectedNoteFilter === true) {
            data.selectedNoteFilter = state.notes.selectedNoteFilter;
        }

        if (options.includeSelectedTaskFilter === true) {
            data.selectedTaskFilter = state.tasks.selectedTaskFilter;
        }

        if (options.includeNoteNumber === true) {
            data.noteNumber = state.notes.filteredBySelectedFilter.length;
        }

        if (options.includeTaskNumber === true) {
            data.taskNumber = state.tasks.filteredBySelectedFilter.length;
        }

        return data;
    };

    const mapDispatchToProps = dispatch => ({
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
    });

    return connect(
        mapStateToProps,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withObjects;