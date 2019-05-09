import { connect } from 'react-redux';
import { addContext, deleteContext, updateContext } from 'actions/ContextActions';
import { addNoteFilter, deleteNoteFilter, updateNoteFilter } from 'actions/NoteFilterActions';
import { addTaskFilter, deleteTaskFilter, updateTaskFilter } from 'actions/TaskFilterActions';
import { addFolder, deleteFolder, updateFolder } from 'actions/FolderActions';
import { addGoal, deleteGoal, updateGoal } from 'actions/GoalActions';
import { addLocation, deleteLocation, updateLocation } from 'actions/LocationActions';
import { deleteTag, updateTag } from 'actions/TagActions';
import { addTaskTemplate, deleteTaskTemplate, updateTaskTemplate } from 'actions/TaskTemplateActions';
import { setSelectedNoteFilter, setSelectedNoteIds } from 'actions/NoteActions';
import { setSelectedTaskFilter, setSelectedTaskIds } from 'actions/TaskActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getNotesFilteredBySelectedFilter, getNotesFilteredByVisibleState, getSelectedNoteFilter } from 'selectors/NoteSelectors';
import { getSelectedTaskFilter, getTasksFilteredBySelectedFilter, getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { merge } from 'utils/ObjectUtils';
import { getTagsFromObjects } from 'utils/TagUtils';
import { getNoteFiltersFilteredByVisibleState } from 'selectors/NoteFilterSelectors';
import { getTaskFiltersFilteredByVisibleState } from 'selectors/TaskFilterSelectors';
import { getTaskTemplatesFilteredByVisibleState } from 'selectors/TaskTemplateSelectors';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';
import { getGoalsFilteredByNonArchived, getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';
import { getFoldersFilteredByNonArchived, getFoldersFilteredByVisibleState } from 'selectors/FolderSelectors';
import { getContextsFilteredByVisibleState } from 'selectors/ContextSelectors';

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
            data.contexts = getContextsFilteredByVisibleState(state);
        }

        if (options.includeFolders === true) {
            data.folders = getFoldersFilteredByVisibleState(state);

            if (options.filteredByNonArchivedFolders === true) {
                data.folders = getFoldersFilteredByNonArchived(state);
            }
        }

        if (options.includeGoals === true) {
            data.goals = getGoalsFilteredByVisibleState(state);

            if (options.filteredByNonArchivedGoals === true) {
                data.goals = getGoalsFilteredByNonArchived(state);
            }
        }

        if (options.includeLocations === true) {
            data.locations = getLocationsFilteredByVisibleState(state);
        }

        if (options.includeTags === true) {
            data.tags = getTagsFromObjects(getNotesFilteredByVisibleState(state).concat(getTasksFilteredByVisibleState(state)));
        }

        if (options.includeTaskTemplates === true) {
            data.taskTemplates = getTaskTemplatesFilteredByVisibleState(state);
        }

        if (options.includeNoteFilters === true) {
            data.noteFilters = getNoteFiltersFilteredByVisibleState(state);
        }

        if (options.includeTaskFilters === true) {
            data.taskFilters = getTaskFiltersFilteredByVisibleState(state);
        }

        if (options.includeSelectedNoteFilter === true) {
            data.selectedNoteFilter = getSelectedNoteFilter(state);
        }

        if (options.includeSelectedTaskFilter === true) {
            data.selectedTaskFilter = getSelectedTaskFilter(state);
        }

        if (options.includeNoteNumber === true) {
            data.noteNumber = getNotesFilteredBySelectedFilter(state).length;
        }

        if (options.includeTaskNumber === true) {
            data.taskNumber = getTasksFilteredBySelectedFilter(state).length;
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