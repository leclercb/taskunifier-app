import moment from 'moment';
import { createSelector } from 'reselect';
import { getSelectedTaskFilter, getSelectedTaskFilterDate, isShowCompletedTasks } from 'selectors/AppSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { store } from 'store/Store';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';
import { findChildren, findParents } from 'utils/HierarchyUtils';
import { sortObjects } from 'utils/SorterUtils';
import { addNonCompletedTasksCondition, hasCompletedTaskConditionOnly } from 'data/DataTaskFilters';

export const getTasks = state => state.tasks;

export const getTasksFilteredByVisibleState = createSelector(
    getTasks,
    (tasks) => {
        return filterByVisibleState(tasks);
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