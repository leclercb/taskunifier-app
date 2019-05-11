import moment from 'moment';
import { createSelector } from 'reselect';
import { getSelectedTaskFilter, getSelectedTaskFilterDate } from 'selectors/AppSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { store } from 'store/Store';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';
import { sortObjects } from 'utils/SorterUtils';

export const getTasks = state => state.tasks;

export const getTasksFilteredByVisibleState = createSelector(
    getTasks,
    (tasks) => {
        return filterByVisibleState(tasks);
    }
);

export const getTasksFilteredBySelectedFilter = createSelector(
    getTasksFilteredByVisibleState, 
    getSelectedTaskFilter, 
    getSelectedTaskFilterDate, 
    getTaskFieldsIncludingDefaults,
    (tasks, selectedTaskFilter, selectedTaskFilterDate, taskFields) => {
        const filteredTasks = tasks.filter(task => {
            if (!selectedTaskFilterDate || moment(task.creationDate).isAfter(moment(selectedTaskFilterDate))) {
                return true;
            }

            return applyFilter(selectedTaskFilter, task, taskFields);
        });

        return sortObjects(filteredTasks, taskFields, selectedTaskFilter, store.getState());
    }
);