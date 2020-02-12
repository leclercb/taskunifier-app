import reduceReducers from 'reduce-reducers';
import { combineReducers } from 'redux';
import undoable, { excludeAction } from 'redux-undo';
import App from 'reducers/App';
import Notes from 'reducers/Notes';
import Objects from 'reducers/Objects';
import Publication from 'reducers/Publication';
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
    notes: undoable(reduceReducers([], Objects('notes'), Notes()), {
        limit: 5,
        filter: process.env.REACT_APP_MODE === 'electron' ? excludeAction(['SET_OBJECTS', 'CHANGE_ID', 'CLEAN_OBJECTS']) : () => false,
        undoType: 'NOTE_UNDO',
        redoType: 'NOTE_REDO'
    }),
    noteFields: Objects('noteFields'),
    noteFilters: Objects('noteFilters'),
    session: Session(),
    settings: Settings(),
    synchronization: Synchronization(),
    publication: Publication(),
    tasks: undoable(reduceReducers([], Objects('tasks'), Tasks()), {
        limit: 5,
        filter: process.env.REACT_APP_MODE === 'electron' ? excludeAction(['SET_OBJECTS', 'CHANGE_ID', 'CLEAN_OBJECTS']) : () => false,
        undoType: 'TASK_UNDO',
        redoType: 'TASK_REDO'
    }),
    taskFields: Objects('taskFields'),
    taskFilters: Objects('taskFilters'),
    taskTemplates: Objects('taskTemplates'),
    thread: Thread()
});