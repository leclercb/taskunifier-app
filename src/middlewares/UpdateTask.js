import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { addObject } from 'actions/ObjectActions';
import { removeDismissedTaskId } from 'actions/TaskActions';
import { getObjectById } from 'selectors/ObjectSelectors';
import { clone } from 'utils/ObjectUtils';
import { canRepeat, getNextDate } from 'utils/RepeatUtils';

export const updateTask = store => next => async action => {
    if (action.type === 'UPDATE_OBJECT' && action.property === 'tasks' && !action.options.skipUpdateMiddleware) {
        const task = action.object;

        const newTask = clone(task);
        const oldTask = getObjectById(store.getState(), action.property, task.id);

        if (task.completed) {
            task.progress = 100;
        }

        if (oldTask && (
            oldTask.startDate !== task.startDate ||
            oldTask.dueDate !== task.dueDate ||
            oldTask.startDateReminder !== task.startDateReminder ||
            oldTask.dueDateReminder !== task.dueDateReminder
        )) {
            await store.dispatch(removeDismissedTaskId(task.id));
        }

        if (oldTask && oldTask.timer && oldTask.timer.startDate) {
            if (!task.timer || !task.timer.startDate) {
                // Timer has been stopped
                task.workLogs = [
                    ...(task.workLogs || []),
                    {
                        id: uuid(),
                        start: oldTask.timer.startDate,
                        end: moment().toISOString()
                    }
                ];
            }
        }

        if (oldTask && !oldTask.completed && task.completed) {
            task.completionDate = action.updateDate;

            if (canRepeat(task)) {
                let skipNewTask;

                newTask.completed = false;
                newTask.progress = 0;

                if (newTask.startDate && newTask.dueDate) {
                    const diff = moment(newTask.dueDate).diff(moment(newTask.startDate), 'second');
                    newTask.dueDate = getNextDate(task.repeat, task.dueDate, action.updateDate);
                    newTask.startDate = moment(newTask.dueDate).subtract(diff, 'second').toISOString();
                    skipNewTask = !newTask.dueDate;
                } else if (newTask.startDate) {
                    newTask.startDate = getNextDate(task.repeat, task.startDate, action.updateDate);
                    skipNewTask = !newTask.startDate;
                } else {
                    newTask.dueDate = getNextDate(task.repeat, task.dueDate, action.updateDate);
                    skipNewTask = !newTask.dueDate;
                }

                if (!skipNewTask) {
                    await store.dispatch(addObject(action.property, newTask));
                }
            }
        }
    }

    return next(action);
};