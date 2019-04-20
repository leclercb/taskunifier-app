import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import App from './App';
import Objects from './Objects';
import Processes from './Processes';
import Settings from './Settings';
import Tasks from './Tasks';
import { onGoalUpdate } from '../utils/GoalUtils';

export default combineReducers({
    app: App(),
    contacts: Objects('contacts'),
    contexts: Objects('contexts'),
    folders: Objects('folders'),
    goals: Objects('goals', onGoalUpdate),
    locations: Objects('locations'),
    tasks: reduceReducers([], Objects('tasks'), Tasks()),
    taskFields: Objects('taskFields'),
    taskFilters: Objects('taskFilters'),
    taskTemplates: Objects('taskTemplates'),
    settings: Settings(),
    processes: Processes()
});