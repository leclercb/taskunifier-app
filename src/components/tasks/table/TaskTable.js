import React from 'react';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { AutoSizer, Column, Table } from 'react-virtualized';
import withTaskFields from 'containers/WithTaskFields';
import withTasks from 'containers/WithTasks';
import withSettings from 'containers/WithSettings';
import withSize from 'containers/WithSize';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import { getWidthForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';
import { TaskMetaDataPropType, TaskPropType } from 'proptypes/TaskPropTypes';
import { getSubLevel, hasChildren } from 'utils/HierarchyUtils';
import { getTaskBackgroundColor, getTaskForegroundColor } from 'utils/SettingUtils';

function TaskTable(props) {
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
                        onResize={({ deltaX }) => onResize(field.id, width + deltaX)}
                        onMove={(dragColumn, dropColumn) => onMove(dragColumn.dataKey, dropColumn.dataKey)} />
                )}
                cellRenderer={({ cellData, rowData }) => {
                    let dndProps = {};

                    if (field.id === 'title') {
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
        <div style={{ overflowY: 'hidden', height: 'calc(100% - 40px)' }}>
            <AutoSizer>
                {({ height }) => (
                    <Table
                        width={tableWidth}
                        height={height}
                        rowHeight={38}
                        headerHeight={20}
                        rowCount={props.tasks.length}
                        rowGetter={({ index }) => props.tasks[index]}
                        rowStyle={({ index }) => {
                            const task = props.tasks[index];

                            if (!task) {
                                return {};
                            }

                            let foregroundColor = getTaskForegroundColor(task, index, props.settings);
                            let backgroundColor = getTaskBackgroundColor(task, index, props.settings);

                            if (props.selectedTaskIds.includes(task.id)) {
                                backgroundColor = '#b8ccbf';
                            }

                            return {
                                color: foregroundColor,
                                backgroundColor,
                                textDecoration: task.completed ? 'line-through' : 'none'
                            };
                        }}
                        onRowClick={multiSelectionHandler(
                            rowData => rowData.id,
                            props.selectedTaskIds,
                            props.setSelectedTaskIds)} >
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
    updateSettings: PropTypes.func.isRequired,
    size: PropTypes.object.isRequired
};

export default withSettings(withTaskFields(withTasks(withSize(TaskTable), {
    includeMetaData: true,
    applySelectedTaskFilter: true
})));
