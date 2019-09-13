import React from 'react';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import TaskMenu from 'components/tasks/table/TaskMenu';
import Constants from 'constants/Constants';
import { getWidthForType, isAlwaysInEditionForType } from 'data/DataFieldTypes';
import { useAppApi } from 'hooks/UseAppApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { getSubLevel, hasChildren } from 'utils/HierarchyUtils';
import { getTaskBackgroundColor, getTaskForegroundColor } from 'utils/SettingUtils';
import 'components/tasks/table/TaskTable.css';

function TaskTable() {
    const appApi = useAppApi();
    const settingsApi = useSettingsApi();
    const taskApi = useTaskApi();
    const taskFieldApi = useTaskFieldApi();

    const onMenuAction = action => {
        const tasks = taskApi.filteredExpandedTasks.filter(task => taskApi.selectedTaskIds.includes(task.id));

        switch (action.type) {
            case 'batchEdit':
                onBatchEditTask();
                break;
            case 'edit':
                tasks.forEach(task => onEditTask(task));
                break;
            case 'duplicate':
                tasks.forEach(task => onDuplicateTask(task));
                break;
            case 'remove':
                onRemoveTasks(tasks.map(task => task.id));
                break;
            case 'postponeStartDate':
                tasks.forEach(task => onPostponeStartDate(task, action.amount, action.unit));
                break;
            case 'postponeDueDate':
                tasks.forEach(task => onPostponeDueDate(task, action.amount, action.unit));
                break;
            default:
                break;
        }
    };

    const onBatchEditTask = () => {
        appApi.setBatchEditTasksManagerOptions({
            visible: true
        });
    };

    const onEditTask = task => {
        appApi.setTaskEditionManagerOptions({
            visible: true,
            taskId: task.id
        });
    };

    const onDuplicateTask = task => {
        taskApi.duplicateTask(task);
    };

    const onRemoveTasks = taskIds => {
        taskApi.deleteTask(taskIds);
    };

    const onPostponeStartDate = (task, amount, unit) => {
        taskApi.updateTask({
            ...task,
            startDate: moment(task.startDate ? task.startDate : undefined).add(amount, unit).toISOString()
        });
    };

    const onPostponeDueDate = (task, amount, unit) => {
        taskApi.updateTask({
            ...task,
            dueDate: moment(task.dueDate ? task.dueDate : undefined).add(amount, unit).toISOString()
        });
    };

    const onUpdateTask = task => {
        taskApi.updateTask(task);
    };

    const onDropTask = (dragData, dropData) => {
        taskApi.updateTask({
            ...dragData.rowData,
            parent: dropData.rowData.id
        });
    };

    let tableWidth = 0;

    const onResize = resizeHandler('taskColumnWidth_', settingsApi.updateSettings);
    const onMove = moveHandler('taskColumnOrder_', taskFieldApi.taskFields, settingsApi.settings, settingsApi.updateSettings);

    const sortedFields = sortBy(taskFieldApi.taskFields, field => settingsApi.settings['taskColumnOrder_' + field.id] || 0);
    const sortedAndFilteredFields = sortedFields.filter(field => settingsApi.settings['taskColumnVisible_' + field.id] !== false);

    const columns = sortedAndFilteredFields.map(field => {
        const settingKey = 'taskColumnWidth_' + field.id;
        let width = Number(settingsApi.settings[settingKey]);

        if (!width) {
            width = getWidthForType(field.type);
        }

        tableWidth += width + 10;

        const getExpandMode = task => {
            let expanded = null;

            if (field.id === 'title') {
                if (hasChildren(task, taskApi.filteredTasks)) {
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
                                object: rowData,
                                rowData
                            },
                            onDrop: onDropTask
                        };
                    }

                    return (
                        <CellRenderer
                            record={rowData}
                            field={field}
                            value={cellData}
                            onChange={allValues => onUpdateTask({
                                ...rowData,
                                ...allValues
                            })}
                            subLevel={field.id === 'title' ? getSubLevel(rowData, taskApi.tasksMetaData) : 0}
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
                        rowHeight={settingsApi.settings.taskTableRowHeight}
                        headerHeight={20}
                        rowCount={taskApi.filteredExpandedTasks.length}
                        rowGetter={({ index }) => taskApi.filteredExpandedTasks[index]}
                        rowRenderer={rendererProps => (
                            <TaskMenu
                                key={rendererProps.key}
                                selectedTaskIds={taskApi.selectedTaskIds}
                                onAction={onMenuAction}>
                                {defaultTableRowRenderer(rendererProps)}
                            </TaskMenu>
                        )}
                        rowStyle={({ index }) => {
                            const task = taskApi.filteredExpandedTasks[index];

                            if (!task) {
                                return {};
                            }

                            let foregroundColor = getTaskForegroundColor(task, index, settingsApi.settings);
                            let backgroundColor = getTaskBackgroundColor(task, index, settingsApi.settings);

                            if (taskApi.selectedTaskIds.includes(task.id)) {
                                foregroundColor = Constants.selectionForegroundColor;
                                backgroundColor = Constants.selectionBackgroundColor;
                            }

                            return {
                                color: foregroundColor,
                                backgroundColor
                            };
                        }}
                        rowClassName={({ index }) => {
                            const task = taskApi.filteredExpandedTasks[index];

                            if (!task) {
                                return '';
                            }

                            const classNames = [];

                            if (taskApi.selectedTaskIds.includes(task.id)) {
                                classNames.push('task-selected');
                            }

                            if (task.completed) {
                                classNames.push('task-completed');
                            }

                            return classNames.join(' ');
                        }}
                        onRowClick={multiSelectionHandler(
                            rowData => rowData.id,
                            taskApi.filteredExpandedTasks,
                            taskApi.selectedTaskIds,
                            taskApi.setSelectedTaskIds,
                            false)}
                        onRowRightClick={multiSelectionHandler(
                            rowData => rowData.id,
                            taskApi.filteredExpandedTasks,
                            taskApi.selectedTaskIds,
                            taskApi.setSelectedTaskIds,
                            true)} >
                        {columns}
                    </Table>
                )}
            </AutoSizer>
        </div>
    );
}

export default TaskTable;
