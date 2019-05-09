export function onGoalUpdate(goal) {
    if (goal.level === 'lifeTime') {
        goal.contributesTo = null;
    }

    return null;
}