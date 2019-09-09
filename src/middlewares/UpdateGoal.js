export const updateGoal = () => next => async action => {
    if (action.type === 'UPDATE_OBJECT' && action.property === 'goals') {
        const goal = action.object;

        if (goal.level === 'lifeTime') {
            goal.contributesTo = null;
        }
    }

    return next(action);
};