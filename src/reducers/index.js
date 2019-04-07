import { combineReducers } from 'redux';
import App from './App';
import Objects from './Objects';
import Status from './Status';

export default combineReducers({
    app: App(),
    contexts: Objects('contexts'),
    fields: Objects('fields'),
    filters: Objects('filters'),
    folders: Objects('folders'),
    tasks: Objects('tasks'),
    status: Status()
});