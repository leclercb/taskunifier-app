import React from 'react';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import { AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import TaskMenu from 'components/tasks/table/TaskMenu';
import Constants from 'constants/Constants';
import withApp from 'containers/WithApp';
import withTaskFields from 'containers/WithTaskFields';
import withTasks from 'containers/WithTasks';
import withSettings from 'containers/WithSettings';
import withSize from 'containers/WithSize';
import { getWidthForType, isAlwaysInEditionForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';
import { TaskMetaDataPropType, TaskPropType } from 'proptypes/TaskPropTypes';
import { getSubLevel, hasChildren } from 'utils/HierarchyUtils';
import { getTaskBackgroundColor, getTaskForegroundColor } from 'utils/SettingUtils';
import 'components/tasks/table/TaskTable.css';

function TaskTable(props) {
    const onMenuAction = action => {
        const tasks = props.tasks.filter(task => props.selectedTaskIds.includes(task.id));

        switch (action.type) {
            case 'batchEdit':
                onBatchEditTask();
                break;
            case 'edit':
                tasks.forEach(task => onEditTask(task));
                break;
            case 'remove':
                tasks.forEach(task => onRemoveTask(task));
                break;
            case 'postponeStartDate':
                tasks.forEach(task => onPostponeStartDate(task, action.amount, action.unit));
                break;
            case 'postponeDueDate':
                tasks.forEach(task => onPostponeDueDate(task, action.amount, action.unit));
                break;
            default:
                break;
        };
    };

    const onBatchEditTask = task => {
        props.setBatchEditTasksManagerOptions({
            visible: true
        });
    };

    const onEditTask = task => {
        props.setTaskEditionManagerOptions({
            visible: true,
            taskId: task.id
        });
    };

    const onRemoveTask = task => {
        props.deleteTask(task.id);
    };

    const onPostponeStartDate = (task, amount, unit) => {
        props.updateTask({
            ...task,
            startDate: moment(task.startDate ? task.startDate : undefined).add(amount, unit).toISOString()
        })
    };

    const onPostponeDueDate = (task, amount, unit) => {
        props.updateTask({
            ...task,
            dueDate: moment(task.dueDate ? task.dueDate : undefined).add(amount, unit).toISOString()
        })
    };

    const onUpdateTask = task => {
        props.updateTask(task);
    };

    const onDropTask = (dragData, dropData) => {
        props.updateTask({
            ...dragData.rowData,
            parent: dropData.rowData.id
        });
    };

    let tableWidth = 0;

    const onResize = resizeHandler('taskColumnWidth_', props.updateSettings);
    const onMove = moveHandler('taskColumnOrder_', props.taskFields, props.settings, props.updateSettings);

    const sortedFields = sortBy(props.taskFields, field => props.settings['taskColumnOrder_' + field.id] || 0);
    const sortedAndFilteredFields = sortedFields.filter(field => props.settings['taskColumnVisible_' + field.id] !== false);

    const columns = sortedAndFilteredFields.map(field => {
        const settingKey = 'taskColumnWidth_' + field.id;
        let width = Number(props.settings[settingKey]);

        if (!width) {
            width = getWidthForType(field.type);
        }

        tableWidth += width + 10;

        const getExpandMode = task => {
            let expanded = null;

            if (field.id === 'title') {
                if (hasChildren(task, props.tasksExpandedAndCollapsed)) {
                    expanded = task.expanded !== false ? 'expanded' : 'collapsed';
                } else {
                    expanded = 'hidden';
                }
            }

            return expanded;
        };

        return (
            <Column
                key={field.id}
                label={field.title}
                dataKey={field.id}
                width={width}
                flexGrow={0}
                flexShrink={0}
                headerRenderer={data => (
                    <ResizableAndMovableColumn
                        dataKey={data.dataKey}
                        label={data.label}
                        sortBy={data.sortBy}
                        sortDirection={data.sortDirection}
                        onResize={data => onResize(data, field.id, width + data.deltaX)}
                        onMove={(dragColumn, dropColumn) => onMove(dragColumn.dataKey, dropColumn.dataKey)} />
                )}
                cellRenderer={({ cellData, rowData }) => {
                    let dndProps = {};

                    if (!isAlwaysInEditionForType(field.type)) {
                        dndProps = {
                            dndEnabled: true,
                            dragType: 'task',
                            dropType: 'task',
                            dndData: {
                                rowData
                            },
                            onDrop: onDropTask
                        };
                    }

                    return (
                        <CellRenderer
                            field={field}
                            value={cellData}
                            onChange={allValues => onUpdateTask({
                                ...rowData,
                                ...allValues
                            })}
                            subLevel={field.id === 'title' ? getSubLevel(rowData, props.tasksMetaData) : 0}
                            expandMode={getExpandMode(rowData)}
                            onSetExpanded={expanded => onUpdateTask({
                                ...rowData,
                                expanded
                            })}
                            {...dndProps} />
                    );
                }} />
        );
    });

    return (
        <div
            className="joyride-task-table"
            style={{ overflowY: 'hidden', height: 'calc(100% - 40px)' }}>
            <AutoSizer>
                {({ height }) => (
                    <Table
                        width={tableWidth}
                        height={height}
                        rowHeight={props.settings.taskTableRowHeight}
                        headerHeight={20}
                        rowCount={props.tasks.length}
                        rowGetter={({ index }) => props.tasks[index]}
                        rowRenderer={rendererProps => (
                            <TaskMenu
                                key={rendererProps.key}
                                selectedTaskIds={props.selectedTaskIds}
                                onAction={onMenuAction}>
                                {defaultTableRowRenderer(rendererProps)}
                            </TaskMenu>
                        )}
                        rowStyle={({ index }) => {
                            const task = props.tasks[index];

                            if (!task) {
                                return {};
                            }

                            let foregroundColor = getTaskForegroundColor(task, index, props.settings);
                            let backgroundColor = getTaskBackgroundColor(task, index, props.settings);

                            if (props.selectedTaskIds.includes(task.id)) {
                                foregroundColor = Constants.selectionForegroundColor;
                                backgroundColor = Constants.selectionBackgroundColor;
                            }

                            return {
                                color: foregroundColor,
                                backgroundColor
                            };
                        }}
                        rowClassName={({ index }) => {
                            const task = props.tasks[index];

                            if (!task) {
                                return '';
                            }

                            return task.completed ? 'task-completed' : '';
                        }}
                        onRowClick={multiSelectionHandler(
                            rowData => rowData.id,
                            props.selectedTaskIds,
                            props.setSelectedTaskIds,
                            false)}
                        onRowRightClick={multiSelectionHandler(
                            rowData => rowData.id,
                            props.selectedTaskIds,
                            props.setSelectedTaskIds,
                            true)} >
                        {columns}
                    </Table>
                )}
            </AutoSizer>
        </div>
    );
}

TaskTable.propTypes = {
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    tasksExpandedAndCollapsed: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    tasksMetaData: PropTypes.arrayOf(TaskMetaDataPropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired,
    selectedTaskFilter: TaskFilterPropType,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
    setBatchEditTasksManagerOptions: PropTypes.func.isRequired,
    setTaskEditionManagerOptions: PropTypes.func.isRequired,
    size: PropTypes.object.isRequired
};

export default withApp(withSettings(withTaskFields(withTasks(withSize(TaskTable), {
    includeMetaData: true,
    applySelectedTaskFilter: true
}))));
