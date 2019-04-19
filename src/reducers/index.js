import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import App from './App';
import Objects from './Objects';
import Processes from './Processes';
import Settings from './Settings';
import Tasks from './Tasks';
import { getDefaultFields } from '../data/DataFields';
import { onGoalUpdate } from '../utils/GoalUtils';

export default combineReducers({
    app: App(),
    contacts: Objects('contacts'),
    contexts: Objects('contexts'),
    fields: Objects('fields', getDefaultFields()),
    filters: Objects('filters'),
    folders: Objects('folders'),
    goals: Objects('goals', [], onGoalUpdate),
    locations: Objects('locations'),
    tasks: reduceReducers([], Objects('tasks'), Tasks()),
    taskTemplates: Objects('taskTemplates'),
    settings: Settings(),
    processes: Processes()
});