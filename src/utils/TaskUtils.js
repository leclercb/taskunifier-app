import { clone } from 'utils/ObjectUtils';
import { canRepeat, getNextDate } from 'utils/RepeatUtils';

export const onTaskUpdate = (task, oldTask) => {
    const newTask = clone(task);

    if (task.completed) {
        task.progress = 100;
    }

    if (oldTask && !oldTask.completed && task.completed) {
        if (canRepeat(task)) {
            newTask.completed = false;
            newTask.progress = 0;
            newTask.startDate = getNextDate(task.repeat, task.startDate);
            newTask.dueDate = getNextDate(task.repeat, task.dueDate);

            return newTask;
        }
    }

    return null;
};