import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import { AutoSizer, Column, SortIndicator, Table } from 'react-virtualized';
import withTaskFields from 'containers/WithTaskFields';
import withTasks from 'containers/WithTasks';
import withSettings from 'containers/WithSettings';
import withSize from 'containers/WithSize';
import CellRenderer from 'components/common/grid/CellRenderer';
import { getValueFromEventForType, getWidthForType } from 'utils/FieldUtils';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import { getTaskBackgroundColor } from 'utils/SettingUtils';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';
import 'components/common/grid/EditableCell.css';

function TaskGrid(props) {
    const onUpdateTask = task => {
        props.updateTask(task);
    };

    const onResize = (fieldId, width) => {
        props.updateSettings({
            ['taskColumnWidth_' + fieldId]: width
        });
    };

    let tableWidth = 0;

    const columns = props.taskFields.map(field => {
        const settingKey = 'taskColumnWidth_' + field.id;
        let width = Number(props.settings[settingKey]);

        if (!width) {
            width = getWidthForType(field.type);
        }

        tableWidth += width;

        return (
            <Column
                key={field.id}
                label={field.title}
                dataKey={field.id}
                width={width}
                flexGrow={0}
                flexShrink={0}
                headerRenderer={({
                    dataKey,
                    label,
                    sortBy,
                    sortDirection,
                }) => {
                    const showSortIndicator = sortBy === dataKey;
                    const children = [
                        <span
                            className="ReactVirtualized__Table__headerTruncatedText"
                            key="label"
                            title={typeof label === 'string' ? label : null}>
                            {label}
                            <Draggable
                                axis="x"
                                defaultClassName="DragHandle"
                                defaultClassNameDragging="DragHandleActive"
                                onDrag={(event, { x }) => onResize(field.id, x)}
                                position={{ x: 0 }}
                                zIndex={999} >
                                <span>⋮</span>
                            </Draggable >
                        </span>
                    ];

                    if (showSortIndicator) {
                        children.push(
                            <SortIndicator key="SortIndicator" sortDirection={sortDirection} />
                        );
                    }

                    children.push(
                    );

                    return children;
                }}
                cellRenderer={({ cellData, rowData }) => (
                    <CellRenderer
                        field={field}
                        value={cellData}
                        onChange={event => {
                            onUpdateTask({
                                ...rowData,
                                [field.id]: getValueFromEventForType(field.type)(event)
                            });
                        }} />
                )} />
        );
    });

    return (
        <div style={{ overflowY: 'auto', height: 'calc(100% - 40px)' }}>
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

                            return {
                                backgroundColor: getTaskBackgroundColor(task, index, props.settings),
                                textDecoration: task.completed ? 'line-through' : 'none'
                            };
                        }}
                        onRowClick={({ rowData }) => props.setSelectedTaskIds([rowData.id])}>
                        {columns}
                    </Table>
                )}
            </AutoSizer>
        </div>
    );
}

TaskGrid.propTypes = {
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    settings: PropTypes.object.isRequired,
    selectedTaskFilter: TaskFilterPropType,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
    size: PropTypes.object.isRequired
};

export default withSettings(withTaskFields(withTasks(withSize(TaskGrid), { applySelectedTaskFilter: true })));