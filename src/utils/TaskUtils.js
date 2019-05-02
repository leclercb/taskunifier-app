import { clone } from "utils/ObjectUtils";
import { canRepeat, getNextDate } from "utils/RepeatUtils";

export const onTaskUpdate = (task, oldTask) => {
    if (oldTask && !oldTask.completed && task.completed) {
        if (canRepeat(task)) {
            const newTask = clone(task);

            newTask.completed = false;
            newTask.startDate = getNextDate(task.repeat, task.startDate);
            newTask.dueDate = getNextDate(task.repeat, task.dueDate);

            return newTask;
        }
    }

    return null;
};