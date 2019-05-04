import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { InfinityTable } from 'antd-table-infinity';
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

    const components = {
        header: {
            cell: ResizableColumn
        },
        body: {
            row: EditableFormRow(DragableBodyRow),
            cell: EditableCell
        }
    };

    const handleResize = field => (e, { size }) => {
        props.updateSettings({
            ['taskColumnWidth_' + field]: size.width
        });
    };

    const columns = props.taskFields.map(field => {
        const settingKey = 'taskColumnWidth_' + field.id;
        let width = props.settings[settingKey];
        let sorter = {};

        if (!width) {
            width = getWidthForType(field.type);
        }

        if (field.id === 'title') {
            sorter = {
                defaultSortOrder: 'ascend',
                sorter: (a, b) => sortObjects(props.selectedTaskFilter, props.taskFields, a, b),
            };
        }

        return {
            ...field,
            ...sorter,
            width: width,
            title: field.title,
            dataIndex: field.id,
            key: field.id,
            editable: true,
            render: value => getRenderForType(field.type, field.options, value),
            onHeaderCell: column => ({
                width: column.width,
                onResize: handleResize(field.id),
            }),
            onCell: record => ({
                width: width,
                record: record,
                editable: true,
                field: field,
                dataIndex: field.id,
                title: field.title,
                onSave: onUpdateTask
            })
        };
    });

    const dummy = false;

    return (
        <div style={{ overflowY: 'auto', height: 'calc(100% - 40px)' }}>
            <InfinityTable
                rowKey="id"
                className="data-grid"
                rowClassName={() => 'editable-row'}
                scroll={{ y: props.size.element.height - 40 }}
                components={components}
                columns={columns}
                dataSource={dummy ? dummyTasks : props.tasks}
                childrenColumnName='children'
                bordered={true}
                size="small"
                pagination={false}
                onRow={(record, index) => {
                    const bgColor = getTaskBackgroundColor(record, index, props.settings);
                    const style = {};

                    if (record.completed) {
                        style.background = `repeating-linear-gradient(
                            135deg, 
                            ${bgColor}, 
                            ${bgColor} 20px, 
                            #b5c2c9 10px, 
                            #b5c2c9 30px)`;
                    } else {
                        style.backgroundColor = bgColor;
                    }

                    return {
                        index: index,
                        rowProps: {
                            record: record,
                            onSave: onUpdateTask,
                            getField: dataIndex => props.taskFields.find(field => field.id === dataIndex),
                            style: style
                        },
                        moveRow: (dragRecord, dropRecord) => {
                            console.log(dragRecord, dropRecord);
                        }
                    };
                }}
                rowSelection={{
                    selectedRowKeys: props.selectedTaskIds,
                    onChange: selectedRowKeys => props.setSelectedTaskIds(selectedRowKeys)
                }} />
        </div>
    );
}

TaskGrid.propTypes = {
    taskFields: PropTypes.arrayOf(FieldPropType).isRequired,
    tasks: PropTypes.arrayOf(TaskPropType).isRequired,
    settings: PropTypes.object.isRequired,
    selectedTaskFilter: TaskFilterPropType,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
    size: PropTypes.object.isRequired,
};

// TODO remove
const dummyTasks = createDummyTasks();

function createDummyTasks() {
    const tasks = [];

    for (let i = 0; i < 1000; i++) {
        tasks.push({
            id: 'task-dummy-' + i,
            refIds: {},
            creationDate: moment().toJSON(),
            state: moment().toJSON(),
            title: 'Task Dummy ' + i,
            color: '#ffffff',
            completed: false,
            importance: '0'
        });
    }

    return tasks;
}

export default withSettings(withTaskFields(withTasks(withSize(TaskGrid), { applySelectedTaskFilter: true })));