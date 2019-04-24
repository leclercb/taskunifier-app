export const onGoalUpdate = (goal, oldGoal) => {
    if (goal.level === 'lifeTime') {
        goal.contributesTo = null;
    }
};