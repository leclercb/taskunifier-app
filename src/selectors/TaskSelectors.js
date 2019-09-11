import moment from 'moment';
import { createSelector } from 'reselect';
import { getSelectedTaskFilter, getSelectedTaskFilterDate } from 'selectors/AppSelectors';
import { isShowCompletedTasks } from 'selectors/SettingSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { store } from 'store/Store';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { addNonCompletedTasksCondition, hasCompletedTaskConditionOnly } from 'data/DataTaskFilters';
import { applyFilter } from 'utils/FilterUtils';
import { findChildren, findParents } from 'utils/HierarchyUtils';
import { showReminder } from 'utils/ReminderUtils';
import { sortObjects } from 'utils/SorterUtils';
import { compareStrings } from 'utils/CompareUtils';

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

export const getTasksFilteredBySelectedFilter = createSelector(
    getTasksFilteredByVisibleState,
    getTasksMetaDataFilteredByVisibleState,
    isShowCompletedTasks,
    getSelectedTaskFilter,
    getSelectedTaskFilterDate,
    getTaskFieldsIncludingDefaults,
    (tasks, tasksMetaData, showCompletedTasks, selectedTaskFilter, selectedTaskFilterDate, taskFields) => {
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

        return sortObjects(filteredTasks, taskFields, selectedTaskFilter, store.getState(), getTasksMetaDataFilteredByVisibleState, true);
    }
);

export const getTasksFilteredBySelectedFilterAndExpanded = createSelector(
    getTasksFilteredBySelectedFilter,
    getTasksMetaDataFilteredByVisibleState,
    (tasks, tasksMetaData) => {
        return tasks.filter(task => {
            const { parents } = tasksMetaData.find(meta => meta.id === task.id);

            for (let parent of parents) {
                if (parent.expanded === false) {
                    return false;
                }
            }

            return true;
        });
    }
);

export const getTaskReminders = createSelector(
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

export const getVisibleTask = createSelector(
    getTasksFilteredByVisibleState,
    (state, id) => id,
    (tasks, id) => {
        return tasks.find(task => task.id === id);
    }
);