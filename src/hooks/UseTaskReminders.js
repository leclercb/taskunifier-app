import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from 'actions/TaskActions';
import { getTaskReminders } from 'selectors/TaskSelectors';

export function useTaskReminders(date) {
    const dispatch = useDispatch();

    const tasks = useSelector(state => getTaskReminders(state, date));

    const updateTaskCallback = useCallback(
        task => dispatch(updateTask(task)),
        [dispatch]
    );

    return {
        tasks,
        updateTask: updateTaskCallback
    };
}