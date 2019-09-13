import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVisibleGoalSelector } from 'selectors/GoalSelectors';

export function useGoal(goalId) {
    const getVisibleGoal = useMemo(getVisibleGoalSelector, []);
    const goal = useSelector(state => getVisibleGoal(state, goalId));
    return goal;
}