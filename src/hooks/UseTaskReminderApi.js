import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from 'actions/TaskActions';
import { getTaskRemindersSelector } from 'selectors/TaskSelectors';

export function useTaskReminderApi(date) {
    const dispatch = useDispatch();

    const getTaskReminders = useMemo(getTaskRemindersSelector, []);
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