import moment from 'moment';
import { createSelector } from 'reselect';
import { getDefaultTaskFields } from 'data/DataTaskFields';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';

const getTasks = state => state.tasks;
const getTaskFields = state => state.taskFields;
const getSettings = state => state.settings;

export const getSelectedTaskIds = state => state.tasks.selectedTaskIds;
export const getSelectedTaskFilter = state => state.tasks.selectedTaskFilter;

export const getTasksFilteredByVisibleState = createSelector(
    [getTasks],
    (tasks) => {
        return filterByVisibleState(tasks.all);
    }
);

export const getTasksFilteredBySelectedFilter = createSelector(
    [getTasks, getTaskFields, getSettings],
    (tasks, taskFields, settings) => {
        const fields = getDefaultTaskFields(settings).concat(filterByVisibleState(taskFields.all));

        return tasks.all.filter(task => {
            if (!tasks.selectedTaskFilterDate ||
                moment(task.creationDate).isAfter(moment(tasks.selectedTaskFilterDate))) {
                return true;
            }

            return applyFilter(tasks.selectedTaskFilter, task, fields);
        });
    }
);