import moment from 'moment';
import { clone } from 'utils/ObjectUtils';
import { canRepeat, getNextDate } from 'utils/RepeatUtils';

export function onTaskUpdate(task, oldTask, updateDate) {
    const newTask = clone(task);

    if (task.completed) {
        task.progress = 100;
    }

    if (oldTask && !oldTask.completed && task.completed) {
        if (canRepeat(task)) {
            newTask.completed = false;
            newTask.progress = 0;

            const diff = moment(newTask.dueDate).diff(newTask.startDate, 'seconds');

            if (newTask.repeatFrom === 'dueDate') {
                newTask.dueDate = getNextDate(task.repeat, task.dueDate);
            } else {
                newTask.dueDate = getNextDate(task.repeat, updateDate);
            }

            newTask.startDate = moment(newTask.dueDate).subtract(diff, 'seconds').toISOString();

            return [newTask];
        }
    }

    return null;
}