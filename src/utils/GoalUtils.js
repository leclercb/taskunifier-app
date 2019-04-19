export const onGoalUpdate = (goal, oldGoal) => {
    if (goal.level === 'life_time') {
        goal.contributesTo = null;
    }
}