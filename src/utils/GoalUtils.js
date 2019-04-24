export const onGoalUpdate = goal => {
    if (goal.level === 'lifeTime') {
        goal.contributesTo = null;
    }
};