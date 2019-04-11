import { loadObjectsFromFile, saveObjectsToFile, setObjects, addObject, updateObject, deleteObject, cleanObjects } from './ObjectActions';

export const loadGoalsFromFile = file => {
    return loadObjectsFromFile('goals', file);
};

export const saveGoalsToFile = (file, data) => {
    return saveObjectsToFile('goals', file, data);
};

export const setGoals = goals => {
    return setObjects('goals', goals);
};

export const addGoal = goal => {
    return addObject('goals', goal);
};

export const updateGoal = goal => {
    return updateObject('goals', goal);
};

export const deleteGoal = goalId => {
    return deleteObject('goals', goalId);
};

export const cleanGoals = () => {
    return cleanObjects('goals');
};