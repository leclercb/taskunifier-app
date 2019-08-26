import React from 'react';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import {
    Item as RCItem,
    Menu as RCMenu,
    MenuProvider as RCMenuProvider,
    Separator as RCSeparator
} from 'react-contexify';
import { AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import Icon from 'components/common/Icon';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import Constants from 'constants/Constants';
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
            <RCMenu id="task_table_row_menu">
                <RCItem onClick={({ props: rowData }) => console.log(rowData)}>
                    <Icon icon="edit" text="Edit" />
                </RCItem>
                <RCItem onClick={({ props: rowData }) => console.log(rowData)}>
                    <Icon icon="calendar-alt" text="Postpone" />
                </RCItem>
                <RCSeparator />
                <RCItem onClick={({ props: rowData }) => console.log(rowData)}>
                    <Icon icon="trash-alt" text="Remove" />
                </RCItem>
            </RCMenu>
            <AutoSizer>
                {({ height }) => (
                    <Table
                        width={tableWidth}
                        height={height}
                        rowHeight={props.settings.taskTableRowHeight}
                        headerHeight={20}
                        rowCount={props.tasks.length}
                        rowGetter={({ index }) => props.tasks[index]}
                        rowRenderer={props => (
                            <RCMenuProvider id="task_table_row_menu" data={props.rowData}>
                                {defaultTableRowRenderer(props)}
                            </RCMenuProvider>
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
