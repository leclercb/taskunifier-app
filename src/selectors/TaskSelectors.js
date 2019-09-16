import moment from 'moment';
import { createSelector } from 'reselect';
import { addNonCompletedTasksCondition, hasCompletedTaskConditionOnly } from 'data/DataTaskFilters';
import { getSelectedTaskFilter, getSelectedTaskFilterDate, getSelectedTaskIds } from 'selectors/AppSelectors';
import { isShowCompletedTasks } from 'selectors/SettingSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { isBusy } from 'selectors/ThreadSelectors';
import { store } from 'store/Store';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';
import { applyFilter } from 'utils/FilterUtils';
import { findChildren, findParents } from 'utils/HierarchyUtils';
import { showReminder } from 'utils/ReminderUtils';
import { sortObjects } from 'utils/SorterUtils';

export const getTasks = state => state.tasks;

export const getTasksFilteredByVisibleState = createSelector(
    getTasks,
    (tasks) => {
        return filterByVisibleState(tasks).sort((a, b) => compareStrings(a.title, b.title));
    }
);

export const getTasksMetaDataFilteredByVisibleState = createSelector(
    getTasksFilteredByVisibleState,
    (tasks) => {
        return tasks.map(task => ({
            id: task.id,
            parents: findParents(task, tasks),
            children: findChildren(task, tasks)
        }));
    }
);

/**
 * WARNING: This selector value is not updated as long as the busy flag is set to true.
 */
let getTasksFilteredBySelectedFilterResult = [];
export const getTasksFilteredBySelectedFilter = createSelector(
    getTasksFilteredByVisibleState,
    getTasksMetaDataFilteredByVisibleState,
    isShowCompletedTasks,
    getSelectedTaskFilter,
    getSelectedTaskFilterDate,
    getTaskFieldsIncludingDefaults,
    isBusy,
    (tasks, tasksMetaData, showCompletedTasks, selectedTaskFilter, selectedTaskFilterDate, taskFields, busy) => {
        if (busy) {
            return getTasksFilteredBySelectedFilterResult;
        }

        if (!showCompletedTasks && !hasCompletedTaskConditionOnly(selectedTaskFilter)) {
            selectedTaskFilter = addNonCompletedTasksCondition(selectedTaskFilter);
        }

        let filteredTasks = tasks.filter(task => {
            if (moment(task.creationDate).isAfter(moment(selectedTaskFilterDate))) {
                return true;
            }

            return applyFilter(selectedTaskFilter, task, taskFields);
        });

        filteredTasks = filteredTasks.filter(task => {
            const { parents } = tasksMetaData.find(meta => meta.id === task.id);

            for (let parent of parents) {
                if (!filteredTasks.includes(parent)) {
                    return false;
                }
            }

            return true;
        });

        const result = sortObjects(filteredTasks, taskFields, selectedTaskFilter, store.getState(), getTasksMetaDataFilteredByVisibleState, true);
        getTasksFilteredBySelectedFilterResult = result;

        return result;
    }
);

export const getTasksFilteredBySelectedFilterAndExpanded = createSelector(
    getTasksFilteredBySelectedFilter,
    getTasksMetaDataFilteredByVisibleState,
    (tasks, tasksMetaData) => {
        return tasks.filter(task => {
            const taskMetaData = tasksMetaData.find(meta => meta.id === task.id);

            if (taskMetaData) {
                for (let parent of taskMetaData.parents) {
                    if (parent.expanded === false) {
                        return false;
                    }
                }
            }

            return true;
        });
    }
);

export const getTaskRemindersSelector = () => createSelector(
    getTasksFilteredBySelectedFilter,
    (state, date) => date,
    (tasks, date) => {
        return tasks.filter(task => {
            if (showReminder(task.startDate, task.startDateReminder, date)) {
                return true;
            }

            if (showReminder(task.dueDate, task.dueDateReminder, date)) {
                return true;
            }

            return false;
        });
    }
);

export const getVisibleTaskSelector = () => createSelector(
    getTasksFilteredByVisibleState,
    (state, id) => id,
    (tasks, id) => {
        return tasks.find(task => task.id === id);
    }
);

export const getSelectedTasks = createSelector(
    getTasks,
    getSelectedTaskIds,
    (tasks, selectedTaskIds) => {
        return tasks.filter(task => selectedTaskIds.includes(task.id));
    }
);