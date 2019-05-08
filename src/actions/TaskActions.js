import moment from 'moment';
import {
    addObject,
    cleanObjects,
    deleteObject,
    loadObjectsFromFile,
    saveObjectsToFile,
    setObjects,
    updateObject
} from 'actions/ObjectActions';

export const loadTasksFromFile = file => {
    return dispatch => dispatch(loadObjectsFromFile('tasks', file));
};

export const saveTasksToFile = (file, data) => {
    return saveObjectsToFile('tasks', file, data);
};

export const setTasks = tasks => {
    return dispatch => dispatch(setObjects('tasks', tasks));
};

export const addTask = task => {
    return dispatch => dispatch(addObject('tasks', task));
};

export const updateTask = task => {
    return dispatch => dispatch(updateObject('tasks', task));
};

export const deleteTask = taskId => {
    return dispatch => dispatch(deleteObject('tasks', taskId));
};

export const cleanTasks = () => {
    return dispatch => dispatch(cleanObjects('tasks'));
};

export const setSelectedTaskIds = taskIds => {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_IDS',
            taskIds: taskIds
        });

        return Promise.resolve();
    };
};

export const setSelectedTaskFilter = taskFilter => {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_TASK_FILTER',
            taskFilter: taskFilter,
            date: moment().toJSON()
        });

        return Promise.resolve();
    };
};