import React, { useState } from 'react';
import { Button, Table } from 'antd';
import { InfinityTable } from 'antd-table-infinity';
import withApp from '../../containers/WithApp';
import withFields from '../../containers/WithFields';
import withTasks from '../../containers/WithTasks';
import { EditableFormRow, EditableCell } from './EditableCell';
import Spacer from '../common/Spacer';
import './EditableCell.css';
import { getWidthForType, getRenderForType } from '../../utils/FieldUtils';
import DragableBodyRow from './DragableBodyRow';

function TaskGrid(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onAddTask = () => {
        props.addTask({
            title: 'Task Test ' + Date.now(),
            completed: false
        }).then(id => setSelectedRowKeys([id]));
    };

    const onUpdateTask = row => {
        props.updateTask(row);
    };

    const onDeleteTask = () => {
        props.deleteTask(selectedRowKeys);
    };

    const components = {
        body: {
            row: EditableFormRow(DragableBodyRow),
            cell: EditableCell
        }
    };

    const columns = props.fields.map(field => {
        return {
            ...field,
            width: field.id === 'title' ? null : getWidthForType(field.type),
            title: field.title,
            dataIndex: field.path,
            key: field.path,
            editable: true,
            render: getRenderForType(field.type),
            onCell: record => ({
                record,
                editable: true,
                type: field.type,
                dataIndex: field.path,
                title: field.title,
                onSave: onUpdateTask
            }),
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
            scroll={dummy ? { y: 450 } : { x: true }}
            onRow={record => ({
                rowProps: {
                    record: record,
                    onSave: onUpdateTask,
                    getFieldType: dataIndex => props.fields.find(field => field.path === dataIndex).type
                }
            })}
            rowSelection={{
                selectedRowKeys: selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => setSelectedRowKeys(selectedRowKeys)
            }}
            footer={() =>
                <React.Fragment>
                    <Button onClick={onAddTask}>Add Task</Button>
                    <Spacer />
                    {selectedRowKeys.length > 0 && <Button onClick={onDeleteTask}>{`Delete Task${selectedRowKeys.length > 1 ? 's' : ''}`}</Button>}
                </React.Fragment>
            } />
    );
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