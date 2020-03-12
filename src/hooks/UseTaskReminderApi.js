import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDismissedTaskId, removeDismissedTaskId } from 'actions/TaskActions';
import { getDismissedTaskIds } from 'selectors/AppSelectors';
import { getTaskRemindersSelector } from 'selectors/TaskSelectors';

export function useTaskReminderApi(date) {
    const dispatch = useDispatch();

    const getTaskReminders = useMemo(getTaskRemindersSelector, []);
    const tasks = useSelector(state => getTaskReminders(state, date));

    const dismissedTaskIds = useSelector(getDismissedTaskIds);

    const addDismissedTaskIdCallback = useCallback(
        taskId => dispatch(addDismissedTaskId(taskId)),
        [dispatch]
    );

    const removeDismissedTaskIdCallback = useCallback(
        taskId => dispatch(removeDismissedTaskId(taskId)),
        [dispatch]
    );

    return {
        tasks,
        dismissedTaskIds,
        addDismissedTaskId: addDismissedTaskIdCallback,
        removeDismissedTaskId: removeDismissedTaskIdCallback
    };
}