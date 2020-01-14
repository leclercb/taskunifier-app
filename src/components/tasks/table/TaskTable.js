import React, { useEffect, useRef } from 'react';
import sortBy from 'lodash/sortBy';
import { ArrowKeyStepper, AutoSizer, MultiGrid } from 'react-virtualized';
import PropTypes from 'prop-types';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import TaskMenu from 'components/tasks/table/TaskMenu';
import Constants from 'constants/Constants';
import withBusyCheck from 'containers/WithBusyCheck';
import { getWidthForType, isAlwaysInEditionForType } from 'data/DataFieldTypes';
import { useAppApi } from 'hooks/UseAppApi';
import { useEditingCellApi } from 'hooks/UseEditingCellApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { getSubLevel, hasChildren } from 'utils/HierarchyUtils';
import { getTaskBackgroundColor, getTaskForegroundColor } from 'utils/SettingUtils';
import 'components/tasks/table/TaskTable.css';

function TaskTable({ apis }) {
    const { appApi, editingCellApi, settingsApi, taskApi, taskFieldApi } = apis;

    const gridRef = useRef();

    const dataSource = taskApi.showTaskHierarchy ? taskApi.filteredExpandedTasks : taskApi.filteredTasks;

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.recomputeGridSize();
        }
    }, [appApi.dataUuid]);

    const onUpdateTask = task => {
        taskApi.updateTask(task);
    };

    const onDropTask = (dragData, dropData) => {
        const found = taskApi.selectedTasks.some(task => task.id === dragData.rowData.id);
        const tasks = found ? taskApi.selectedTasks : [dragData.rowData];

        tasks.forEach(task => {
            taskApi.updateTask({
                ...task,
                parent: dropData.rowData.id
            });
        });
    };

    const onResize = resizeHandler('taskColumnWidth_', settingsApi.updateSettings);
    const onMove = moveHandler('taskColumnOrder_', taskFieldApi.taskFields, settingsApi.settings, settingsApi.updateSettings);

    const sortedFields = sortBy(taskFieldApi.taskFields, field => ('taskColumnOrder_' + field.id) in settingsApi.settings ? settingsApi.settings['taskColumnOrder_' + field.id] : field.defaultOrder || 0);
    const sortedAndFilteredFields = sortedFields.filter(field => settingsApi.settings['taskColumnVisible_' + field.id] !== false);

    const getColumnWidth = columnIndex => {
        const field = sortedAndFilteredFields[columnIndex];
        const settingKey = 'taskColumnWidth_' + field.id;
        let width = Number(settingsApi.settings[settingKey]);

        if (!width || width < 10) {
            width = getWidthForType(field.type);
        }

        return width;
    };

    let totalWidth = 0;

    sortedAndFilteredFields.forEach((field, index) => {
        totalWidth += getColumnWidth(index);
    });

    const getCellRenderer = ({ columnIndex, rowIndex }) => { // eslint-disable-line react/prop-types
        const field = sortedAndFilteredFields[columnIndex];

        if (rowIndex === 0) {
            return (
                <ResizableAndMovableColumn
                    dataKey={field.id}
                    label={(<strong>{field.title}</strong>)}
                    onResize={async data => {
                        await onResize(data, field.id, getColumnWidth(columnIndex) + data.deltaX);

                        if (gridRef.current && data.stop) {
                            gridRef.current.recomputeGridSize();
                        }
                    }}
                    onMove={async (dragColumn, dropColumn) => {
                        await onMove(dragColumn.dataKey, dropColumn.dataKey);
                        gridRef.current.recomputeGridSize();
                    }} />
            );
        }

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

        const rowData = dataSource[rowIndex - 1];
        const cellData = rowData[field.id];

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
            <TaskMenu selectedTasks={taskApi.selectedTasks}>
                <CellRenderer
                    record={rowData}
                    field={field}
                    value={cellData}
                    onChange={allValues => {
                        taskApi.setSelectedTaskIds(rowData.id);
                        return onUpdateTask({
                            ...rowData,
                            ...allValues
                        });
                    }}
                    subLevel={taskApi.showTaskHierarchy && field.id === 'title' ? getSubLevel(rowData, taskApi.tasksMetaData) : 0}
                    expandMode={taskApi.showTaskHierarchy ? getExpandMode(rowData) : null}
                    onSetExpanded={expanded => onUpdateTask({
                        ...rowData,
                        expanded
                    })}
                    {...dndProps} />
            </TaskMenu>
        );
    };

    let scrollToIndex = undefined;

    if (taskApi.selectedTaskIds.length === 1) {
        const index = dataSource.findIndex(task => task.id === taskApi.selectedTaskIds[0]);

        if (index >= 0) {
            scrollToIndex = index;
        }
    }

    if (editingCellApi.editingCell) {
        const index = dataSource.findIndex(task => task.id === editingCellApi.editingCell.objectId);

        if (index >= 0) {
            scrollToIndex = index;
        }
    }

    return (
        <div
            className="joyride-task-table"
            style={{ height: 'calc(100% - 40px)' }}>
            <AutoSizer>
                {({ width, height }) => (
                    <ArrowKeyStepper
                        columnCount={sortedAndFilteredFields.length}
                        rowCount={dataSource.length + 1}
                        mode="cells"
                        isControlled={true}
                        disabled={scrollToIndex === undefined}
                        scrollToRow={scrollToIndex !== undefined ? scrollToIndex + 1 : undefined}
                        onScrollToChange={({ scrollToRow }) => taskApi.setSelectedTaskIds(dataSource[scrollToRow - 1].id)}>
                        {({ onSectionRendered }) => (
                            <MultiGrid
                                ref={gridRef}
                                width={width}
                                height={height}
                                scrollToRow={scrollToIndex ? scrollToIndex + 1 : undefined}
                                onSectionRendered={onSectionRendered}
                                columnCount={sortedAndFilteredFields.length}
                                columnWidth={({ index }) => getColumnWidth(index)}
                                estimatedColumnSize={totalWidth / sortedAndFilteredFields.length}
                                fixedColumnCount={0}
                                rowHeight={settingsApi.settings.taskTableRowHeight}
                                rowCount={dataSource.length + 1}
                                fixedRowCount={1}
                                cellRenderer={({ columnIndex, rowIndex, key, style }) => {
                                    const task = dataSource[rowIndex - 1];
                                    const classNames = [];

                                    if (task && taskApi.selectedTaskIds.includes(task.id)) {
                                        classNames.push('task-selected');
                                    }

                                    if (task && task.completed) {
                                        classNames.push('task-completed');
                                    }

                                    style = {
                                        ...style,
                                        padding: '0px 5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    };

                                    if (task) {
                                        let foregroundColor = getTaskForegroundColor(task, rowIndex - 1, settingsApi.settings);
                                        let backgroundColor = getTaskBackgroundColor(task, rowIndex - 1, settingsApi.settings);

                                        if (settingsApi.settings.showImportanceColor) {
                                            style.borderBottom = '1px solid #e3ebf2';
                                        }

                                        if (taskApi.selectedTaskIds.includes(task.id)) {
                                            foregroundColor = Constants.selectionForegroundColor;
                                            backgroundColor = Constants.selectionBackgroundColor;
                                        }

                                        style.color = foregroundColor;
                                        style.backgroundColor = backgroundColor;
                                    }

                                    const onClick = (event, rightClick) => {
                                        if (task) {
                                            multiSelectionHandler(
                                                rowData => rowData.id,
                                                dataSource,
                                                taskApi.selectedTaskIds,
                                                taskApi.setSelectedTaskIds,
                                                rightClick)({ event, rowData: task });
                                        }
                                    };

                                    return (
                                        <div
                                            key={key}
                                            style={style}
                                            className={classNames.join(' ')}
                                            onClick={event => onClick(event, false)}
                                            onDoubleClick={() => taskApi.setSelectedTaskIds(task.id)}
                                            onContextMenu={event => onClick(event, true)}>
                                            {getCellRenderer({ columnIndex, rowIndex })}
                                        </div>
                                    );
                                }} />
                        )}
                    </ArrowKeyStepper>
                )}
            </AutoSizer>
        </div>
    );
}

TaskTable.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(TaskTable, () => ({
    appApi: useAppApi(),
    editingCellApi: useEditingCellApi(),
    settingsApi: useSettingsApi(),
    taskApi: useTaskApi(),
    taskFieldApi: useTaskFieldApi()
}));