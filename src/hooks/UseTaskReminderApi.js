import { useCallback, useMemo } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { addDismissedTaskId, removeDismissedTaskId, updateTask } from 'actions/TaskActions';
import { getDismissedTaskIds } from 'selectors/AppSelectors';
import { getTaskRemindersSelector } from 'selectors/TaskSelectors';
import { showReminder } from 'utils/ReminderUtils';

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

    const updateTaskCallback = useCallback(
        task => dispatch(updateTask(task)),
        [dispatch]
    );

    const snoozeTask = (task, item) => {
        if (showReminder(task.startDate, task.startDateReminder)) {
            updateTaskCallback({
                ...task,
                startDateReminder: moment(task.startDate).subtract(item.amount, item.unit).diff(moment(), 'second')
            });
        }

        if (showReminder(task.dueDate, task.dueDateReminder)) {
            updateTaskCallback({
                ...task,
                dueDateReminder: moment(task.dueDate).subtract(item.amount, item.unit).diff(moment(), 'second')
            });
        }
    };

    return {
        tasks,
        dismissedTaskIds,
        addDismissedTaskId: addDismissedTaskIdCallback,
        removeDismissedTaskId: removeDismissedTaskIdCallback,
        snoozeTask
    };
}