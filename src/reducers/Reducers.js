import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import App from 'reducers/App';
import Notes from 'reducers/Notes';
import Objects from 'reducers/Objects';
import Session from 'reducers/Session';
import Settings from 'reducers/Settings';
import Synchronization from 'reducers/Synchronization';
import Tasks from 'reducers/Tasks';
import Thread from 'reducers/Thread';

export default combineReducers({
    app: App(),
    contacts: Objects('contacts'),
    contexts: Objects('contexts'),
    folders: Objects('folders'),
    goals: Objects('goals'),
    locations: Objects('locations'),
    notes: reduceReducers([], Objects('notes'), Notes()),
    noteFields: Objects('noteFields'),
    noteFilters: Objects('noteFilters'),
    session: Session(),
    settings: Settings(),
    synchronization: Synchronization(),
    tasks: reduceReducers([], Objects('tasks'), Tasks()),
    taskFields: Objects('taskFields'),
    taskFilters: Objects('taskFilters'),
    taskTemplates: Objects('taskTemplates'),
    thread: Thread()
});