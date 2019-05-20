import { connect } from 'react-redux';
import { setSelectedTaskFilter, setSelectedTaskIds } from 'actions/AppActions';
import { setCalendarDateMode, setSelectedCalendarView, setShowCompletedTasks } from 'actions/SettingActions';
import {
    addTask,
    deleteTask,
    updateTask
} from 'actions/TaskActions';
import withBusyCheck from 'containers/WithBusyCheck';
import {
    getSelectedTaskFilter,
    getSelectedTaskIds
} from 'selectors/AppSelectors';
import { getCalendarDateMode, getSelectedCalendarView, isShowCompletedTasks } from 'selectors/SettingSelectors';
import {
    getTasksFilteredBySelectedFilter,
    getTasksFilteredBySelectedFilterAndExpanded,
    getTasksFilteredByVisibleState,
    getTasksMetaDataFilteredByVisibleState
} from 'selectors/TaskSelectors';
import { merge } from 'utils/ObjectUtils';

function withTasks(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true,
        includeMetaData: false,
        applySelectedTaskFilter: false
    }, options || {});

    const mapStateToProps = state => {
        const result = {
            selectedCalendarView: getSelectedCalendarView(state),
            showCompletedTasks: isShowCompletedTasks(state),
            calendarDateMode: getCalendarDateMode(state),
            selectedTaskIds: getSelectedTaskIds(state),
            selectedTaskFilter: getSelectedTaskFilter(state)
        };

        if (options.applySelectedTaskFilter === true) {
            result.tasks = getTasksFilteredBySelectedFilterAndExpanded(state);
            result.tasksExpandedAndCollapsed = getTasksFilteredBySelectedFilter(state);
        } else {
            result.tasks = getTasksFilteredByVisibleState(state);
        }

        if (options.includeMetaData === true) {
            result.tasksMetaData = getTasksMetaDataFilteredByVisibleState(state);
        }

        return result;
    };

    const mapDispatchToProps = dispatch => ({
        addTask: task => dispatch(addTask(task)),
        updateTask: task => dispatch(updateTask(task)),
        deleteTask: taskId => dispatch(deleteTask(taskId)),
        setSelectedCalendarView: show => dispatch(setSelectedCalendarView(show)),
        setShowCompletedTasks: show => dispatch(setShowCompletedTasks(show)),
        setCalendarDateMode: mode => dispatch(setCalendarDateMode(mode)),
        setSelectedTaskIds: taskIds => dispatch(setSelectedTaskIds(taskIds)),
        setSelectedTaskFilter: taskFilter => dispatch(setSelectedTaskFilter(taskFilter))
    });

    return connect(
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withTasks;