import React, { useState } from 'react';
import { Button, Table } from 'antd';
import withApp from '../../containers/WithApp';
import withFields from '../../containers/WithFields';
import withTasks from '../../containers/WithTasks';
import { EditableFormRow, EditableCell } from './EditableCell';
import './EditableCell.css';
import Spacer from '../common/Spacer';

function TaskGrid(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onAddTask = () => {
        props.addTask({
            title: 'Task Test ' + Date.now(),
            completed: false
        });
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
            onCell: record => ({
                record,
                editable: true,
                type: field.type,
                dataIndex: field.path,
                title: field.title,
                onSave: onUpdateTask,
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
            rowSelection={{
                selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => setSelectedRowKeys(selectedRowKeys),
            }}
            footer={currentPageData =>
                <React.Fragment>
                    <Button onClick={onAddTask}>Add Task</Button>
                    <Spacer />
                    {selectedRowKeys.length > 0 && <Button onClick={onDeleteTask}>{`Delete Task${selectedRowKeys.length > 1 ? 's' : ''}`}</Button>}
                </React.Fragment>
            } />
    );
}

export default withApp(withFields(withTasks(TaskGrid)));