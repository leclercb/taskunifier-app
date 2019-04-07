import { loadObjectsFromFile, saveObjectsToFile, setObjects, addObject, updateObject, deleteObject } from './ObjectActions';

export const loadTasksFromFile = file => {
    return loadObjectsFromFile('tasks', file);
};

export const saveTasksToFile = file => {
    return saveObjectsToFile('tasks', file);
};

export const setTasks = tasks => {
    return setObjects('tasks', tasks);
};

export const addTask = task => {
    return addObject('tasks', task);
};

export const updateTask = task => {
    return updateObject('tasks', task);
};

export const deleteTask = taskId => {
    return deleteObject('tasks', taskId);
};