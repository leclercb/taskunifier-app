import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadGoalsFromFile(file) {
    return loadObjectsFromFile('goals', file);
};

export function saveGoalsToFile(file, data) {
    return saveObjectsToFile('goals', file, data);
};

export function setGoals(goals) {
    return setObjects('goals', goals);
};

export function addGoal(goal) {
    return addObject('goals', goal);
};

export function updateGoal(goal) {
    return updateObject('goals', goal);
};

export function deleteGoal(goalId) {
    return deleteObject('goals', goalId);
};

export function cleanGoals() {
    return cleanObjects('goals');
};