import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import { getDefaultSelectedNoteFilter } from 'data/DataNoteFilters';
import { getDefaultSelectedTaskFilter } from 'data/DataTaskFilters';
import App from 'reducers/App';
import Folders from 'reducers/Folders';
import Goals from 'reducers/Goals';
import Notes from 'reducers/Notes';
import Objects from 'reducers/Objects';
import Processes from 'reducers/Processes';
import Settings from 'reducers/Settings';
import Tasks from 'reducers/Tasks';
import { onGoalUpdate } from 'utils/GoalUtils';
import { onTaskUpdate } from 'utils/TaskUtils';

export default combineReducers({
    app: App(),
    contacts: Objects('contacts'),
    contexts: Objects('contexts'),
    folders: reduceReducers({
        all: [],
        filteredByVisibleState: [],
        filteredByNonArchived: []
    }, Objects('folders'), Folders()),
    goals: reduceReducers({
        all: [],
        filteredByVisibleState: [],
        filteredByNonArchived: []
    }, Objects('goals', onGoalUpdate), Goals()),
    locations: Objects('locations'),
    notes: reduceReducers({
        all: [],
        filteredByVisibleState: [],
        filteredBySelectedFilter: [],
        selectedNoteIds: [],
        selectedNoteFilter: getDefaultSelectedNoteFilter(),
        selectedNoteFilterDate: null
    }, Objects('notes'), Notes()),
    noteFields: Objects('noteFields'),
    noteFilters: Objects('noteFilters'),
    tasks: reduceReducers({
        all: [],
        filteredByVisibleState: [],
        filteredBySelectedFilter: [],
        selectedTaskIds: [],
        selectedTaskFilter: getDefaultSelectedTaskFilter(),
        selectedTaskFilterDate: null
    }, Objects('tasks', onTaskUpdate), Tasks()),
    taskFields: Objects('taskFields'),
    taskFilters: Objects('taskFilters'),
    taskTemplates: Objects('taskTemplates'),
    settings: Settings(),
    processes: Processes()
});