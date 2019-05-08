import moment from 'moment';
import { createSelector } from 'reselect';
import { getDefaultTaskFields } from 'data/DataTaskFields';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';

const getTaskFields = state => state.taskFields;
const getSettings = state => state.settings;

export const getTasks = state => state.tasks;

export const getSelectedTaskIds = state => state.app.selectedTaskIds;
export const getSelectedTaskFilter = state => state.app.selectedTaskFilter;
export const getSelectedTaskFilterDate = state => state.app.selectedTaskFilterDate;

export const getTasksFilteredByVisibleState = createSelector(
    [getTasks],
    (tasks) => {
        return filterByVisibleState(tasks);
    }
);

export const getTasksFilteredBySelectedFilter = createSelector(
    [getTasks, getSelectedTaskFilter, getSelectedTaskFilterDate, getTaskFields, getSettings],
    (tasks, selectedTaskFilter, selectedTaskFilterDate, taskFields, settings) => {
        const fields = getDefaultTaskFields(settings).concat(filterByVisibleState(taskFields));

        return tasks.filter(task => {
            if (!selectedTaskFilterDate || moment(task.creationDate).isAfter(moment(selectedTaskFilterDate))) {
                return true;
            }

            return applyFilter(selectedTaskFilter, task, fields);
        });
    }
);