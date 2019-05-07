import React from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, Grid } from 'react-virtualized';
import CellRenderer from 'components/common/grid/CellRenderer';
import withTaskFields from 'containers/WithTaskFields';
import withTasks from 'containers/WithTasks';
import withSettings from 'containers/WithSettings';
import withSize from 'containers/WithSize';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import { getValueFromEventForType, getWidthForType } from 'utils/FieldUtils';
import { merge } from 'utils/ObjectUtils';
import { getTaskBackgroundColor } from 'utils/SettingUtils';
import 'components/common/grid/EditableCell.css';

function TaskGrid(props) {
    const onUpdateTask = task => {
        props.updateTask(task);
    };

    const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const field = props.taskFields[columnIndex];

        if (rowIndex === 0) {
            style = merge(style, {
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '0px 8px'
            });

            return (
                <div
                    key={key}
                    style={style}>
                    {field.title}
                </div>
            );
        }

        const task = props.tasks[rowIndex - 1];

        style = merge(style, {
            backgroundColor: getTaskBackgroundColor(task, rowIndex - 1, props.settings),
            textDecoration: task.completed ? 'line-through' : 'none',
            display: 'flex',
            alignItems: 'center',
            padding: '0px 8px'
        })

        return (
            <div
                key={key}
                style={style}>
                <CellRenderer
                    field={field}
                    value={task[field.id]}
                    onChange={event => {
                        onUpdateTask({
                            ...task,
                            [field.id]: getValueFromEventForType(field.type)(event)
                        });
                    }} />
            </div>
        )
    }

    return (
        <div style={{ overflowY: 'auto', height: 'calc(100% - 40px)' }}>
            <AutoSizer>
                {({ width, height }) => (
                    <Grid
                        width={width}
                        height={height}
                        headerHeight={20}
                        columnCount={props.taskFields.length}
                        columnWidth={({ index }) => {
                            const field = props.taskFields[index];
                            const settingKey = 'taskColumnWidth_' + field.id;

                            let width = Number(props.settings[settingKey]);

                            if (!width) {
                                width = getWidthForType(field.type);
                            }

                            return width;
                        }}
                        rowCount={props.tasks.length + 1}
                        rowHeight={({ index }) => index === 0 ? 20 : 38}
                        cellRenderer={cellRenderer} />
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