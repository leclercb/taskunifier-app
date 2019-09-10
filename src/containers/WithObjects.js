import { connect } from 'react-redux';
import { setSelectedNoteFilter, setSelectedNoteIds, setSelectedTaskFilter, setSelectedTaskIds } from 'actions/AppActions';
import { addContact, updateContact, deleteContact } from 'actions/ContactActions';
import { addContext, deleteContext, updateContext } from 'actions/ContextActions';
import { addFolder, deleteFolder, updateFolder } from 'actions/FolderActions';
import { addGoal, deleteGoal, updateGoal } from 'actions/GoalActions';
import { addLocation, deleteLocation, updateLocation } from 'actions/LocationActions';
import { addNote, updateNote, deleteNote } from 'actions/NoteActions';
import { addNoteField, updateNoteField, deleteNoteField } from 'actions/NoteFieldActions';
import { addNoteFilter, deleteNoteFilter, updateNoteFilter } from 'actions/NoteFilterActions';
import { setCalendarDateMode, setSelectedCalendarView, setShowCompletedTasks } from 'actions/SettingActions';
import { deleteTag, updateTag } from 'actions/TagActions';
import { addTask, updateTask, deleteTask } from 'actions/TaskActions';
import { addTaskField, updateTaskField, deleteTaskField } from 'actions/TaskFieldActions';
import { addTaskFilter, deleteTaskFilter, updateTaskFilter } from 'actions/TaskFilterActions';
import { addTaskTemplate, deleteTaskTemplate, updateTaskTemplate } from 'actions/TaskTemplateActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getSelectedNoteFilter, getSelectedTaskFilter } from 'selectors/AppSelectors';
import { getContactsFilteredByVisibleState } from 'selectors/ContactSelectors';
import { getContextsFilteredByVisibleState } from 'selectors/ContextSelectors';
import { getGoalsFilteredByNonArchived, getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';
import { getFoldersFilteredByNonArchived, getFoldersFilteredByVisibleState } from 'selectors/FolderSelectors';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';
import { getNoteFieldsFilteredByVisibleState } from 'selectors/NoteFieldSelectors';
import { getNoteFiltersFilteredByVisibleState } from 'selectors/NoteFilterSelectors';
import { getNotesFilteredBySelectedFilter, getNotesFilteredByVisibleState } from 'selectors/NoteSelectors';
import { getCalendarDateMode, getSelectedCalendarView, getSettings, isShowCompletedTasks } from 'selectors/SettingSelectors';
import { getTaskFieldsFilteredByVisibleState } from 'selectors/TaskFieldSelectors';
import { getTaskFiltersFilteredByVisibleState } from 'selectors/TaskFilterSelectors';
import { getTasksFilteredBySelectedFilter, getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getTaskTemplatesFilteredByVisibleState } from 'selectors/TaskTemplateSelectors';
import { merge } from 'utils/ObjectUtils';
import { getTagsFromObjects } from 'utils/TagUtils';

function withObjects(Component, options) {
    options = merge({
        includeDispatch: false,
        includeContacts: false,
        includeContexts: false,
        includeFolders: false,
        includeGoals: false,
        includeLocations: false,
        includeNotes: false,
        includeNoteFields: false,
        includeNoteFilters: false,
        includeTasks: false,
        includeTaskFields: false,
        includeTaskFilters: false,
        includeTaskTemplates: false,
        includeTags: false,
        includeSelectedNoteFilter: false,
        includeSelectedCalendarView: false,
        includeShowCompletedTasks: false,
        includeCalendarDateMode: false,
        includeSelectedTaskFilter: false,
        includeNoteNumber: false,
        includeTaskNumber: false,
        filteredByNonArchivedFolders: false,
        filteredByNonArchivedGoals: false
    }, options || {});

    const mapStateToProps = state => {
        const settings = getSettings(state);
        const data = {};

        if (options.includeContacts === true) {
            data.contacts = getContactsFilteredByVisibleState(state);
        }

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

        if (options.includeNotes === true) {
            data.notes = getNotesFilteredByVisibleState(state);
        }

        if (options.includeNoteFields === true) {
            data.noteFields = getNoteFieldsFilteredByVisibleState(state);
        }

        if (options.includeNoteFilters === true) {
            data.noteFilters = getNoteFiltersFilteredByVisibleState(state);
        }

        if (options.includeTasks === true) {
            data.tasks = getTasksFilteredByVisibleState(state);
        }

        if (options.includeTaskFields === true) {
            data.taskFields = getTaskFieldsFilteredByVisibleState(state);
        }

        if (options.includeTaskFilters === true) {
            data.taskFilters = getTaskFiltersFilteredByVisibleState(state);
        }

        if (options.includeTaskTemplates === true) {
            data.taskTemplates = getTaskTemplatesFilteredByVisibleState(state);
        }

        if (options.includeTags === true) {
            data.tags = getTagsFromObjects(getNotesFilteredByVisibleState(state).concat(getTasksFilteredByVisibleState(state)), settings);
        }

        if (options.includeSelectedNoteFilter === true) {
            data.selectedNoteFilter = getSelectedNoteFilter(state);
        }

        if (options.includeSelectedCalendarView === true) {
            data.selectedCalendarView = getSelectedCalendarView(state);
        }

        if (options.includeShowCompletedTasks === true) {
            data.showCompletedTasks = isShowCompletedTasks(state);
        }

        if (options.includeCalendarDateMode === true) {
            data.calendarDateMode = getCalendarDateMode(state);
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
        addContact: contact => dispatch(addContact(contact)),
        updateContact: contact => dispatch(updateContact(contact)),
        deleteContact: contactId => dispatch(deleteContact(contactId)),
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
        addNote: note => dispatch(addNote(note)),
        updateNote: note => dispatch(updateNote(note)),
        deleteNote: noteId => dispatch(deleteNote(noteId)),
        addNoteField: noteField => dispatch(addNoteField(noteField)),
        updateNoteField: noteField => dispatch(updateNoteField(noteField)),
        deleteNoteField: noteFieldId => dispatch(deleteNoteField(noteFieldId)),
        addNoteFilter: noteFilter => dispatch(addNoteFilter(noteFilter)),
        updateNoteFilter: noteFilter => dispatch(updateNoteFilter(noteFilter)),
        deleteNoteFilter: noteFilterId => dispatch(deleteNoteFilter(noteFilterId)),
        addTask: task => dispatch(addTask(task)),
        updateTask: task => dispatch(updateTask(task)),
        deleteTask: taskId => dispatch(deleteTask(taskId)),
        addTaskField: taskField => dispatch(addTaskField(taskField)),
        updateTaskField: taskField => dispatch(updateTaskField(taskField)),
        deleteTaskField: taskFieldId => dispatch(deleteTaskField(taskFieldId)),
        addTaskFilter: taskFilter => dispatch(addTaskFilter(taskFilter)),
        updateTaskFilter: taskFilter => dispatch(updateTaskFilter(taskFilter)),
        deleteTaskFilter: taskFilterId => dispatch(deleteTaskFilter(taskFilterId)),
        addTaskTemplate: taskTemplate => dispatch(addTaskTemplate(taskTemplate)),
        updateTaskTemplate: taskTemplate => dispatch(updateTaskTemplate(taskTemplate)),
        deleteTaskTemplate: taskTemplateId => dispatch(deleteTaskTemplate(taskTemplateId)),
        updateTag: tag => dispatch(updateTag(tag)),
        deleteTag: tagId => dispatch(deleteTag(tagId)),
        setSelectedNoteIds: noteIds => dispatch(setSelectedNoteIds(noteIds)),
        setSelectedNoteFilter: noteFilter => dispatch(setSelectedNoteFilter(noteFilter)),
        setSelectedCalendarView: view => dispatch(setSelectedCalendarView(view)),
        setShowCompletedTasks: show => dispatch(setShowCompletedTasks(show)),
        setCalendarDateMode: mode => dispatch(setCalendarDateMode(mode)),
        setSelectedTaskIds: taskIds => dispatch(setSelectedTaskIds(taskIds)),
        setSelectedTaskFilter: taskFilter => dispatch(setSelectedTaskFilter(taskFilter))
    });

    return connect(
        mapStateToProps,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withObjects;