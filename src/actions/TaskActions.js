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
    return (dispatch, getState) => dispatch(loadObjectsFromFile('tasks', file, getExtraProps(getState())));
};

export const saveTasksToFile = (file, data) => {
    return saveObjectsToFile('tasks', file, data);
};

export const setTasks = tasks => {
    return (dispatch, getState) => dispatch(setObjects('tasks', tasks, getExtraProps(getState())));
};

export const addTask = task => {
    return (dispatch, getState) => dispatch(addObject('tasks', task, getExtraProps(getState())));
};

export const updateTask = task => {
    return (dispatch, getState) => dispatch(updateObject('tasks', task, getExtraProps(getState())));
};

export const deleteTask = taskId => {
    return (dispatch, getState) => dispatch(deleteObject('tasks', taskId, getExtraProps(getState())));
};

export const cleanTasks = () => {
    return (dispatch, getState) => dispatch(cleanObjects('tasks', getExtraProps(getState())));
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
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SELECTED_TASK_FILTER',
            taskFilter: taskFilter,
            date: moment().toJSON(),
            ...getExtraProps(getState())
        });

        return Promise.resolve();
    };
};

const getExtraProps = state => {
    return {
        settings: state.settings,
        taskFields: state.taskFields
    };
};