import { combineReducers } from 'redux';
import App from './App';
import Objects from './Objects';
import Status from './Status';
import Settings from './Settings';

export default combineReducers({
    app: App(),
    contexts: Objects('contexts'),
    fields: Objects('fields'),
    filters: Objects('filters'),
    folders: Objects('folders'),
    goals: Objects('goals'),
    locations: Objects('locations'),
    tasks: Objects('tasks'),
    settings: Settings(),
    status: Status()
});