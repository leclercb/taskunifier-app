import moment from 'moment';
import { addObject } from 'actions/ObjectActions';
import { getObjectById } from 'selectors/ObjectSelectors';
import { clone } from 'utils/ObjectUtils';
import { canRepeat, getNextDate } from 'utils/RepeatUtils';

export const updateTask = store => next => async action => {
    if (action.type === 'UPDATE_OBJECT' && action.property === 'tasks') {
        const task = action.object;

        const newTask = clone(task);
        const oldTask = getObjectById(store.getState(), action.property, task.id);

        if (task.completed) {
            task.progress = 100;
        }

        if (oldTask && !oldTask.completed && task.completed) {
            newTask.completionDate = action.updateDate;

            if (canRepeat(task)) {
                newTask.completed = false;
                newTask.progress = 0;

                if (newTask.startDate && newTask.dueDate) {
                    const diff = moment(newTask.dueDate).diff(moment(newTask.startDate), 'seconds');
                    newTask.dueDate = getNextDate(task.repeat, task.dueDate, action.updateDate);
                    newTask.startDate = moment(newTask.dueDate).subtract(diff, 'seconds').toISOString();
                } else if (newTask.startDate) {
                    newTask.startDate = getNextDate(task.repeat, task.startDate, action.updateDate);
                } else {
                    newTask.dueDate = getNextDate(task.repeat, task.dueDate, action.updateDate);
                }

                await store.dispatch(addObject(action.property, newTask));
            }
        }
    }

    return next(action);
};