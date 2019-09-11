import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVisibleTaskFieldSelector } from 'selectors/TaskFieldSelectors';

export function useTaskField(taskFieldId) {
    const getVisibleTaskField = useMemo(getVisibleTaskFieldSelector, []);
    const taskField = useSelector(state => getVisibleTaskField(state, taskFieldId));
    return taskField;
}