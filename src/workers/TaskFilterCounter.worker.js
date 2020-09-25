import {
    combineConditions,
    containsCompletedTaskCondition,
    createFutureTasksCondition,
    createNonCompletedTasksCondition,
    createSearchTaskValueCondition,
    createTaskFilterFromDefinition
} from 'data/DataTaskFilters';
import { applyFilter } from 'utils/FilterUtils';

onmessage = function (event) {
    const data = event.data;
    const counts = {};

    if (!data.taskFilers) {
        return;
    }

    data.taskFilters.forEach(filter => {
        counts[filter.id] = getCount(
            data.tasks,
            data.searchTaskValue,
            data.showCompletedTasks,
            data.showFutureTasks,
            filter,
            data.taskFields,
            data.taskFilters,
            data.combinedTaskFilterDefinitions,
            data.categoryTaskSorters
        );
    });

    postMessage(counts);
};

function getCount(tasks, searchTaskValue, showCompletedTasks, showFutureTasks, selectedTaskFilter, taskFields, taskFilters, combinedTaskFilterDefinitions, categoryTaskSorters) {
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

    const filteredTasks = tasks.filter(task => applyFilter(selectedTaskFilter, task, taskFields));

    return filteredTasks.length;
}