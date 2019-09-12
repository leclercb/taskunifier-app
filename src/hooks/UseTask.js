import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVisibleTaskSelector } from 'selectors/TaskSelectors';

export function useTask(taskId) {
    const getVisibleTask = useMemo(getVisibleTaskSelector, []);
    const task = useSelector(state => getVisibleTask(state, taskId));
    return task;
}