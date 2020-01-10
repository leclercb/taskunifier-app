import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTaskValue, setSelectedTaskFilter, setSelectedTaskIds } from 'actions/AppActions';
import {
    setCalendarDateMode,
    setSelectedCalendarView,
    setShowCompletedTasks,
    setShowFutureTasks,
    setShowTaskHierarchy
} from 'actions/SettingActions';
import { addTask, deleteTask, duplicateTask, updateTask } from 'actions/TaskActions';
import { getSearchTaskValue, getSelectedTaskFilter, getSelectedTaskIds } from 'selectors/AppSelectors';
import {
    getCalendarDateMode,
    getSelectedCalendarView,
    isShowCompletedTasks,
    isShowFutureTasks,
    isShowTaskHierarchy
} from 'selectors/SettingSelectors';
import {
    getSelectedTasks,
    getStatistics,
    getTasksFilteredBySelectedFilter,
    getTasksFilteredBySelectedFilterAndExpanded,
    getTasksFilteredByVisibleState,
    getTasksMetaDataFilteredByVisibleState
} from 'selectors/TaskSelectors';

export function useTaskApi() {
    const dispatch = useDispatch();

    const tasks = useSelector(getTasksFilteredByVisibleState);
    const tasksMetaData = useSelector(getTasksMetaDataFilteredByVisibleState);
    const filteredTasks = useSelector(getTasksFilteredBySelectedFilter);
    const filteredExpandedTasks = useSelector(getTasksFilteredBySelectedFilterAndExpanded);
    const statistics = useSelector(getStatistics);

    const selectedTaskIds = useSelector(getSelectedTaskIds);
    const selectedTasks = useSelector(getSelectedTasks);
    const selectedTaskFilter = useSelector(getSelectedTaskFilter);
    const searchTaskValue = useSelector(getSearchTaskValue);

    const selectedCalendarView = useSelector(getSelectedCalendarView);
    const showTaskHierarchy = useSelector(isShowTaskHierarchy);
    const showCompletedTasks = useSelector(isShowCompletedTasks);
    const showFutureTasks = useSelector(isShowFutureTasks);
    const calendarDateMode = useSelector(getCalendarDateMode);

    const addTaskCallback = useCallback(
        task => dispatch(addTask(task)),
        [dispatch]
    );

    const duplicateTaskCallback = useCallback(
        task => dispatch(duplicateTask(task)),
        [dispatch]
    );

    const updateTaskCallback = useCallback(
        task => dispatch(updateTask(task)),
        [dispatch]
    );

    const deleteTaskCallback = useCallback(
        taskId => dispatch(deleteTask(taskId)),
        [dispatch]
    );

    const setSelectedTaskIdsCallback = useCallback(
        taskIds => dispatch(setSelectedTaskIds(taskIds)),
        [dispatch]
    );

    const setSelectedTaskFilterCallback = useCallback(
        taskFilter => dispatch(setSelectedTaskFilter(taskFilter)),
        [dispatch]
    );

    const setSearchTaskValueCallback = useCallback(
        value => dispatch(setSearchTaskValue(value)),
        [dispatch]
    );

    const setSelectedCalendarViewCallback = useCallback(
        show => dispatch(setSelectedCalendarView(show)),
        [dispatch]
    );

    const setShowTaskHierarchyCallback = useCallback(
        show => dispatch(setShowTaskHierarchy(show)),
        [dispatch]
    );

    const setShowCompletedTasksCallback = useCallback(
        show => dispatch(setShowCompletedTasks(show)),
        [dispatch]
    );

    const setShowFutureTasksCallback = useCallback(
        show => dispatch(setShowFutureTasks(show)),
        [dispatch]
    );

    const setCalendarDateModeCallback = useCallback(
        mode => dispatch(setCalendarDateMode(mode)),
        [dispatch]
    );

    return {
        tasks,
        tasksMetaData,
        filteredTasks,
        filteredExpandedTasks,
        statistics,
        selectedTaskIds,
        selectedTasks,
        selectedTaskFilter,
        searchTaskValue,
        selectedCalendarView,
        showTaskHierarchy,
        showCompletedTasks,
        showFutureTasks,
        calendarDateMode,
        addTask: addTaskCallback,
        duplicateTask: duplicateTaskCallback,
        updateTask: updateTaskCallback,
        deleteTask: deleteTaskCallback,
        setSelectedTaskIds: setSelectedTaskIdsCallback,
        setSelectedTaskFilter: setSelectedTaskFilterCallback,
        setSearchTaskValue: setSearchTaskValueCallback,
        setSelectedCalendarView: setSelectedCalendarViewCallback,
        setShowTaskHierarchy: setShowTaskHierarchyCallback,
        setShowCompletedTasks: setShowCompletedTasksCallback,
        setShowFutureTasks: setShowFutureTasksCallback,
        setCalendarDateMode: setCalendarDateModeCallback
    };
}