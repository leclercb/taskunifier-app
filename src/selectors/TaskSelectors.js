import moment from 'moment';
import { createSelector } from 'reselect';
import {
    combineConditions,
    containsCompletedTaskCondition,
    createFutureTasksCondition,
    createNonCompletedTasksCondition,
    createSearchTaskValueCondition,
    createTaskFilterFromDefinition
} from 'data/DataTaskFilters';
import { getMinuteTimer, getSearchTaskValue, getSelectedTaskFilter, getSelectedTaskFilterDate, getSelectedTaskIds } from 'selectors/AppSelectors';
import { getCategoryTaskSorters, getCombinedTaskFilterDefinitions, isShowCompletedTasks, isShowFutureTasks, isShowTaskHierarchy } from 'selectors/SettingSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { getTaskFiltersFilteredByVisibleState } from 'selectors/TaskFilterSelectors';
import { isBusy } from 'selectors/ThreadSelectors';
import { store } from 'store/Store';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';
import { applyFilter } from 'utils/FilterUtils';
import { findChildren, findParents } from 'utils/HierarchyUtils';
import { showReminder } from 'utils/ReminderUtils';
import { sortObjects } from 'utils/SorterUtils';
import { getDurationForDay, getWorkLogsWithTimer } from 'utils/WorkLogUtils';

export const canUndoTaskStateUpdate = state => state.tasks.past.length > 0;
export const canRedoTaskStateUpdate = state => state.tasks.future.length > 0;

export const getTasks = state => state.tasks.present;

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
    getSearchTaskValue,
    isShowTaskHierarchy,
    isShowCompletedTasks,
    isShowFutureTasks,
    getSelectedTaskFilter,
    getSelectedTaskFilterDate,
    getTaskFieldsIncludingDefaults,
    getTaskFiltersFilteredByVisibleState,
    getCombinedTaskFilterDefinitions,
    getCategoryTaskSorters,
    isBusy,
    (tasks, tasksMetaData, searchTaskValue, showTaskHierarchy, showCompletedTasks, showFutureTasks, selectedTaskFilter, selectedTaskFilterDate, taskFields, taskFilters, combinedTaskFilterDefinitions, categoryTaskSorters, busy) => {
        if (busy) {
            return getTasksFilteredBySelectedFilterResult;
        }

        const extraConditions = [];

        if (searchTaskValue) {
            extraConditions.push(createSearchTaskValueCondition(searchTaskValue));
        }

        if (!showCompletedTasks && !containsCompletedTaskCondition(selectedTaskFilter)) {
            extraConditions.push(createNonCompletedTasksCondition());
        }

        if (!showFutureTasks) {
            extraConditions.push(createFutureTasksCondition());
        }

        (combinedTaskFilterDefinitions || []).forEach(filterDefinition => {
            const filter = createTaskFilterFromDefinition(filterDefinition, taskFilters, categoryTaskSorters);

            if (filter) {
                extraConditions.push(filter.condition);
            }
        });

        selectedTaskFilter = combineConditions(selectedTaskFilter, extraConditions);

        const filteredTasks = tasks.filter(task => {
            if (moment(task.creationDate).isAfter(moment(selectedTaskFilterDate))) {
                return true;
            }

            return applyFilter(selectedTaskFilter, task, taskFields);
        });

        const parentsToAdd = [];

        if (showTaskHierarchy) {
            filteredTasks.forEach(task => {
                const { parents } = tasksMetaData.find(meta => meta.id === task.id);

                for (let parent of parents) {
                    if (!filteredTasks.includes(parent) && !parentsToAdd.includes(parent)) {
                        parentsToAdd.push(parent);
                    }
                }
            });
        }

        filteredTasks.push(...parentsToAdd);

        const result = sortObjects(filteredTasks, taskFields, selectedTaskFilter, store.getState(), getTasksMetaDataFilteredByVisibleState, showTaskHierarchy);
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

export const getStatistics = createSelector(
    getMinuteTimer,
    getTasksFilteredByVisibleState,
    getTasksFilteredBySelectedFilter,
    (minuteTimer, tasks, filteredTasks) => {
        const computeStats = tasks => {
            const stats = { nbTotal: tasks.length, nbCompleted: 0, length: 0, elapsed: 0, elapsedToday: 0 };

            for (let task of tasks) {
                if (task.completed) {
                    stats.nbCompleted++;
                    continue;
                }

                stats.length += task.length || 0;
                stats.elapsed += task.timer ? task.timer.value || 0 : 0;

                if (task.timer && task.timer.startDate) {
                    stats.elapsed += moment(minuteTimer).diff(moment(task.timer.startDate), 'second');
                }

                const workLogs = getWorkLogsWithTimer(task.workLogs, task.timer, minuteTimer);
                const totalToday = workLogs.reduce((total, workLog) => total + getDurationForDay(workLog, minuteTimer), 0);

                stats.elapsedToday += totalToday;
            }

            return stats;
        };

        return {
            tasks: computeStats(tasks),
            filteredTasks: computeStats(filteredTasks)
        };
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