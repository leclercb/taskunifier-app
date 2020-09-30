export const updateGoal = () => next => async action => {
    if (action.type === 'UPDATE_OBJECTS' && action.property === 'goals' && !action.options.skipUpdateMiddleware) {
        for (let goal of action.objects) {
            if (goal.level === 'lifeTime') {
                goal.contributesTo = null;
            }
        }
    }

    return next(action);
};