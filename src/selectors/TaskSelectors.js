import moment from 'moment';
import { createSelector } from 'reselect';
import { getSelectedTaskFilter, getSelectedTaskFilterDate } from 'selectors/AppSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { store } from 'store/Store';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';
import { findChildren, findParents } from 'utils/HierarchyUtils';
import { sortObjects } from 'utils/SorterUtils';

export const getTasks = createSelector(
    state => state.tasks,
    (tasks) => {
        return tasks.map(task => ({
            ...task,
            _parents: findParents(task, tasks),
            _children: findChildren(task, tasks)
        }));
    }
);

export const getTasksFilteredByVisibleState = createSelector(
    getTasks,
    (tasks) => {
        tasks = filterByVisibleState(tasks);

        return tasks.map(task => ({
            ...task,
            _parentsFilteredByVisibleState: findParents(task, tasks),
            _childrenFilteredByVisibleState: findChildren(task, tasks)
        }));
    }
);

export const getTasksFilteredBySelectedFilter = createSelector(
    getTasksFilteredByVisibleState,
    getSelectedTaskFilter,
    getSelectedTaskFilterDate,
    getTaskFieldsIncludingDefaults,
    (tasks, selectedTaskFilter, selectedTaskFilterDate, taskFields) => {
        let filteredTasks = tasks.filter(task => {
            if (!selectedTaskFilterDate || moment(task.creationDate).isAfter(moment(selectedTaskFilterDate))) {
                return true;
            }

            return applyFilter(selectedTaskFilter, task, taskFields);
        });

        filteredTasks = filteredTasks.filter(task => {
            const parents = task._parentsFilteredByVisibleState;

            for (let parent of parents) {
                if (parent.expanded === false || !filteredTasks.find(task => task.id === parent.id)) {
                    return false;
                }
            }

            return true;
        });

        return sortObjects(filteredTasks, taskFields, selectedTaskFilter, store.getState());
    }
);