import { 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    addObject, 
    updateObject, 
    deleteObject, 
    cleanObjects 
} from './ObjectActions';

export const loadTasksFromFile = file => {
    return loadObjectsFromFile('tasks', file);
};

export const saveTasksToFile = (file, data) => {
    return saveObjectsToFile('tasks', file, data);
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

export const cleanTasks = () => {
    return cleanObjects('tasks');
};