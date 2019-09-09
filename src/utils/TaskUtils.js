import moment from 'moment';
import { clone } from 'utils/ObjectUtils';
import { canRepeat, getNextDate } from 'utils/RepeatUtils';

export function onTaskUpdate(task, oldTask, updateDate) {
    const newTask = clone(task);

    if (task.completed) {
        task.progress = 100;
    }

    if (oldTask && !oldTask.completed && task.completed) {
        newTask.completionDate = updateDate;

        if (canRepeat(task)) {
            newTask.completed = false;
            newTask.progress = 0;

            if (newTask.startDate && newTask.dueDate) {
                const diff = moment(newTask.dueDate).diff(moment(newTask.startDate), 'seconds');
                newTask.dueDate = getNextDate(task.repeat, task.dueDate, updateDate);
                newTask.startDate = moment(newTask.dueDate).subtract(diff, 'seconds').toISOString();
            } else if (newTask.startDate) {
                newTask.startDate = getNextDate(task.repeat, task.startDate, updateDate);
            } else {
                newTask.dueDate = getNextDate(task.repeat, task.dueDate, updateDate);
            }

            return [newTask];
        }
    }

    return null;
}