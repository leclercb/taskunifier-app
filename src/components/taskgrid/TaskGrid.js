import React, { useState } from 'react';
import { Table } from 'antd';
import withApp from '../../containers/WithApp';
import withTasks from '../../containers/WithTasks';
import { EditableFormRow, EditableCell } from './EditableCell';
import './EditableCell.css';

const columns = [
    {
        title: 'Completed',
        dataIndex: 'completed',
        key: 'completed'
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        editable: true
    }
];

function TaskGrid(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSave = row => {
        console.log(row);
    };

    const components = {
        body: {
            row: EditableFormRow,
            cell: EditableCell,
        },
    };

    const newColumns = columns.map(column => {
        if (!column.editable) {
            return column;
        }

        return {
            ...column,
            onCell: record => ({
                record,
                editable: column.editable,
                dataIndex: column.dataIndex,
                title: column.title,
                onSave: onSave,
            }),
        };
    });

    return (
        <React.Fragment>
            {"Filter: " + (props.selectedFilter ? props.selectedFilter.title : '')}
            <Table
                rowKey="id"
                components={components}
                columns={newColumns}
                dataSource={props.tasks}
                bordered={true}
                rowClassName={() => 'editable-row'}
                size="small"
                rowSelection={{
                    selectedRowKeys,
                    onChange: (selectedRowKeys, selectedRows) => setSelectedRowKeys(selectedRowKeys),
                }} />
        </React.Fragment>
    );
}

export default withApp(withTasks(TaskGrid));