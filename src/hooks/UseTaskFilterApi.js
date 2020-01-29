import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTaskFilter, deleteTaskFilter, duplicateTaskFilter, updateTaskFilter } from 'actions/TaskFilterActions';
import { getTaskFilterCounts } from 'selectors/AppSelectors';
import { getTaskFiltersFilteredByVisibleState } from 'selectors/TaskFilterSelectors';

export function useTaskFilterApi() {
    const dispatch = useDispatch();
    const taskFilters = useSelector(getTaskFiltersFilteredByVisibleState);
    const taskFilterCounts = useSelector(getTaskFilterCounts);

    const addTaskFilterCallback = useCallback(
        taskFilter => dispatch(addTaskFilter(taskFilter)),
        [dispatch]
    );

    const duplicateTaskFilterCallback = useCallback(
        taskFilter => dispatch(duplicateTaskFilter(taskFilter)),
        [dispatch]
    );

    const updateTaskFilterCallback = useCallback(
        taskFilter => dispatch(updateTaskFilter(taskFilter)),
        [dispatch]
    );

    const deleteTaskFilterCallback = useCallback(
        taskFilterId => dispatch(deleteTaskFilter(taskFilterId)),
        [dispatch]
    );

    return {
        taskFilters,
        taskFilterCounts,
        addTaskFilter: addTaskFilterCallback,
        duplicateTaskFilter: duplicateTaskFilterCallback,
        updateTaskFilter: updateTaskFilterCallback,
        deleteTaskFilter: deleteTaskFilterCallback
    };
}