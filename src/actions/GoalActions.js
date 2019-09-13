import {
    addObject,
    cleanObjects,
    deleteObject,
    duplicateObject,
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile,
    setObjects,
    updateObject
} from 'actions/ObjectActions';

export function loadGoalsFromFile(file) {
    return loadObjectsFromFile('goals', file);
}

export function saveGoalsToFile(file, data) {
    return saveObjectsToFile('goals', file, data);
}

export function loadGoalsFromServer() {
    return loadObjectsFromServer('goals');
}

export function setGoals(goals) {
    return setObjects('goals', goals);
}

export function addGoal(goal, options = {}) {
    return addObject('goals', goal, options);
}

export function duplicateGoal(goal, options = {}) {
    return duplicateObject('goals', goal, options);
}

export function updateGoal(goal, options = {}) {
    return updateObject('goals', goal, options);
}

export function deleteGoal(goalId, options = {}) {
    return deleteObject('goals', goalId, options);
}

export function cleanGoals() {
    return cleanObjects('goals');
}