import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { addObject } from 'actions/ObjectActions';
import { removeDismissedTaskId } from 'actions/TaskActions';
import { getObjectById } from 'selectors/ObjectSelectors';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { findChildren } from 'utils/HierarchyUtils';
import { clone } from 'utils/ObjectUtils';
import { canRepeat, getNextDate, isRepeatWithParent } from 'utils/RepeatUtils';

export const updateTask = store => next => async action => {
    if (action.type === 'UPDATE_OBJECTS' && action.property === 'tasks' && !action.options.skipUpdateMiddleware) {
        for (let task of action.objects) {
            let newTask = clone(task);
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
                    if (repeatTask(task, newTask, task.repeat, action.updateDate)) {
                        newTask = await store.dispatch(addObject(action.property, newTask));

                        const children = findChildren(oldTask, getTasksFilteredByVisibleState(store.getState())).filter(task => isRepeatWithParent(task.repeat));

                        for (let child of children) {
                            const newChild = clone(child);

                            newChild.parent = newTask.id;

                            repeatTask(child, newChild, task.repeat, action.updateDate);

                            await store.dispatch(addObject(action.property, newChild));
                        }
                    }
                }
            }
        }
    }

    return next(action);
};

function repeatTask(currentTask, newTask, repeat, now) {
    newTask.completed = false;
    newTask.progress = 0;

    if (newTask.startDate && newTask.dueDate) {
        const diff = moment(newTask.dueDate).diff(moment(newTask.startDate), 'second');
        newTask.dueDate = getNextDate(repeat, currentTask.dueDate, now);
        newTask.startDate = moment(newTask.dueDate).subtract(diff, 'second').toISOString();
        return !!newTask.dueDate;
    } else if (newTask.startDate) {
        newTask.startDate = getNextDate(repeat, currentTask.startDate, now);
        return !!newTask.startDate;
    } else {
        newTask.dueDate = getNextDate(repeat, currentTask.dueDate, now);
        return !!newTask.dueDate;
    }
}