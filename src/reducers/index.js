import { combineReducers } from 'redux';
import App from './App';
import Contexts from './Contexts';
import Filters from './Filters';
import Folders from './Folders';
import Tasks from './Tasks';
import Status from './Status';

export default combineReducers({
    app: App,
    contexts: Contexts,
    contextsStatus: Status('CONTEXTS'),
    filters: Filters,
    filtersStatus: Status('FILTERS'),
    folders: Folders,
    foldersStatus: Status('FOLDERS'),
    tasks: Tasks,
    tasksStatus: Status('TASKS'),
});