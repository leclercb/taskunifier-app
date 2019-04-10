import React, { useState } from 'react';
import { Button, Table } from 'antd';
import withApp from '../../containers/WithApp';
import withFields from '../../containers/WithFields';
import withTasks from '../../containers/WithTasks';
import { EditableFormRow, EditableCell } from './EditableCell';
import './EditableCell.css';
import Spacer from '../common/Spacer';
import { getRenderFromType } from '../fields/FieldComponents';

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
            row: EditableFormRow,
            cell: EditableCell,
        },
    };

    const columns = props.fields.map(field => {
        return {
            ...field,
            title: field.title,
            dataIndex: field.path,
            key: field.path,
            editable: true,
            render: getRenderFromType(field.type),
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

    return (
        <Table
            rowKey="id"
            components={components}
            columns={columns}
            dataSource={props.tasks}
            bordered={true}
            rowClassName={record => 'editable-row importance-' + record.importance}
            size="small"
            pagination={false}
            rowSelection={{
                selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => setSelectedRowKeys(selectedRowKeys),
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

    for (let i = 0; i < 100; i++) {
        tasks.push({
            id: 'task-dummy-' + i,
            refIds: {},
            properties: {},
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

export default withApp(withFields(withTasks(TaskGrid)));