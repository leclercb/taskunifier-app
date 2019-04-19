import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import App from './App';
import Objects from './Objects';
import Status from './Status';
import Settings from './Settings';
import Tasks from './Tasks';
import { getDefaultFields } from '../data/DataFields';

export default combineReducers({
    app: App(),
    contacts: Objects('contacts'),
    contexts: Objects('contexts'),
    fields: Objects('fields', getDefaultFields()),
    filters: Objects('filters'),
    folders: Objects('folders'),
    goals: Objects('goals'),
    locations: Objects('locations'),
    tasks: reduceReducers([], Objects('tasks'), Tasks()),
    taskTemplates: Objects('taskTemplates'),
    settings: Settings(),
    status: Status()
});