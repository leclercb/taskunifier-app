import React from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, Column, Table } from 'react-virtualized';
import withTaskFields from 'containers/WithTaskFields';
import withTasks from 'containers/WithTasks';
import withSettings from 'containers/WithSettings';
import withSize from 'containers/WithSize';
import { EditableCell, EditableFormRow } from 'components/common/grid/EditableCell';
import ResizableColumn from 'components/common/grid/ResizableColumn';
import { getRenderForType, getWidthForType } from 'utils/FieldUtils';
import DragableBodyRow from 'components/common/grid/DragableBodyRow';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import { getTaskBackgroundColor } from 'utils/SettingUtils';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';
import { sortObjects } from 'utils/SortUtils';
import 'components/common/grid/EditableCell.css';

function TaskGrid(props) {
    const onUpdateTask = task => {
        props.updateTask(task);
    };

    const columns = props.taskFields.map(field => {
        const settingKey = 'taskColumnWidth_' + field.id;
        let width = props.settings[settingKey];

        if (!width) {
            width = getWidthForType(field.type);
        }

        return (
            <Column
                key={field.id}
                label={field.title}
                dataKey={field.id}
                width={Number(width)}
                cellRenderer={({ cellData }) => getRenderForType(field.type, field.options, cellData)} />
        );
    });

    return (
        <div style={{ overflowY: 'auto', height: 'calc(100% - 40px)' }}>
            <AutoSizer>
                {({ width, height }) => (
                    <Table
                        width={width}
                        height={height}
                        rowHeight={30}
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
                        }}>
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