import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { InfinityTable } from 'antd-table-infinity';
import withApp from '../../containers/WithApp';
import withFields from '../../containers/WithFields';
import withTasks from '../../containers/WithTasks';
import { EditableFormRow, EditableCell } from './EditableCell';
import ResizableColumn from './ResizableColumn';
import { getWidthForType, getRenderForType } from '../../utils/FieldUtils';
import DragableBodyRow from './DragableBodyRow';
import { FieldPropType } from '../../proptypes/FieldPropTypes';
import { TaskPropType } from '../../proptypes/TaskPropTypes';
import './EditableCell.css';

function TaskGrid(props) {
    const onUpdateTask = row => {
        props.updateTask(row);
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

    const handleResize = index => (e, { size }) => {
        console.log(index, size, e);
    };

    const columns = props.fields.map(field => {
        return {
            ...field,
            width: getWidthForType(field.type),
            title: field.title,
            dataIndex: field.id,
            key: field.id,
            editable: true,
            render: getRenderForType(field.type),
            onHeaderCell: column => ({
                width: column.width,
                onResize: handleResize(index),
            }),
            onCell: record => ({
                record,
                editable: true,
                type: field.type,
                dataIndex: field.id,
                title: field.title,
                onSave: onUpdateTask
            })
        };
    });

    const dummy = false;

    return (
        <Table
            rowKey="id"
            components={components}
            columns={columns}
            dataSource={dummy ? dummyTasks : props.tasks}
            childrenColumnName='children'
            bordered={true}
            rowClassName={record => 'editable-row task-importance-' + record.importance + ' ' + (record.completed ? 'task-completed' : '')}
            size="small"
            pagination={false}
            onRow={record => ({
                rowProps: {
                    record: record,
                    onSave: onUpdateTask,
                    getFieldType: dataIndex => props.fields.find(field => field.id === dataIndex).type
                }
            })}
            rowSelection={{
                selectedRowKeys: props.selectedTaskIds,
                onChange: selectedRowKeys => props.setSelectedTaskIds(selectedRowKeys)
            }} />
    );
}

TaskGrid.propTypes = {
    fields: PropTypes.arrayOf(FieldPropType).isRequired,
    tasks: PropTypes.arrayOf(TaskPropType).isRequired,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired
}

// TODO remove
const dummyTasks = createDummyTasks();

function createDummyTasks() {
    const tasks = [];

    for (let i = 0; i < 1000; i++) {
        tasks.push({
            id: 'task-dummy-' + i,
            refIds: {},
            creationDate: 1554795588054,
            updateDate: 1554897001063,
            status: 'TO_UPDATE',
            title: 'Task Dummy ' + i,
            color: '#ffffff',
            completed: false,
            importance: '0'
        })
    }

    return tasks;
}

export default withApp(withFields(withTasks(TaskGrid, { applySelectedFilter: true })));