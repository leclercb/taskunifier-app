import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Button, Table } from 'antd';
import withSettings from 'containers/WithSettings';
import { getDefaultLinkedTaskFields } from 'data/DataLinkedTaskFields';
import { EditableCell, EditableFormRow } from 'components/common/grid/EditableCell';
import ResizableColumn from 'components/common/grid/ResizableColumn';
import { getRenderForType, getWidthForType } from 'utils/FieldUtils';
import { LinkedTaskPropType } from 'proptypes/LinkedTaskPropTypes';
import { getLinkedTaskBackgroundColor } from 'utils/SettingUtils';
import '../../common/grid/EditableCell.css';
import Icon from 'components/common/Icon';

function LinkedTaskGrid(props) {
    const onAddLinkedTask = () => {
        props.updateLinkedTasks([
            ...props.linkedTasks,
            {
                id: uuid(),
                link: null,
                task: null
            }
        ]);
    };

    const onUpdateLinkedTask = linkedTask => {
        const index = props.linkedTasks.findIndex(item => item.id === linkedTask.id);
        const linkedTasks = [...props.linkedTasks];
        linkedTasks[index] = linkedTask;
        props.updateLinkedTasks(linkedTasks);
    };

    const onDeleteLinkedTask = linkedTask => {
        const index = props.linkedTasks.findIndex(item => item.id === linkedTask.id);
        const linkedTasks = [...props.linkedTasks];
        linkedTasks.splice(index, 1);
        props.updateLinkedTasks(linkedTasks);
    };

    const components = {
        header: {
            cell: ResizableColumn
        },
        body: {
            row: EditableFormRow(),
            cell: EditableCell
        }
    };

    const handleResize = field => (e, { size }) => {
        props.updateSettings({
            ['linkedTaskColumnWidth_' + field]: size.width
        });
    };

    const linkedTaskFields = getDefaultLinkedTaskFields();

    const columns = linkedTaskFields.map(field => {
        const settingKey = 'linkedTaskColumnWidth_' + field.id;
        let width = props.settings[settingKey];

        if (!width) {
            width = getWidthForType(field.type);
        }

        return {
            ...field,
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
                record: record,
                editable: true,
                field: field,
                dataIndex: field.id,
                title: field.title,
                onSave: onUpdateLinkedTask
            })
        };
    });

    let deleteColumnWidth = props.settings['linkedTaskColumnWidth_delete'];

    if (!deleteColumnWidth) {
        deleteColumnWidth = 50;
    }

    columns.push({
        width: deleteColumnWidth,
        title: 'Delete',
        dataIndex: 'delete',
        key: 'delete',
        editable: false,
        render: (value, record) => (
            <Icon icon="trash-alt" onClick={() => onDeleteLinkedTask(record)} />
        ),
        onHeaderCell: column => ({
            width: column.width,
            onResize: handleResize('delete'),
        }),
    });

    return (
        <div style={{ overflowY: 'auto' }}>
            <Table
                rowKey="id"
                className="data-grid"
                rowClassName={() => 'editable-row'}
                components={components}
                columns={columns}
                dataSource={props.linkedTasks}
                bordered={true}
                size="small"
                pagination={false}
                onRow={(record, index) => ({
                    rowProps: {
                        record: record,
                        onSave: onUpdateLinkedTask,
                        getField: dataIndex => linkedTaskFields.find(field => field.id === dataIndex),
                        style: {
                            backgroundColor: getLinkedTaskBackgroundColor(record, index, props.settings)
                        }
                    }
                })}
                footer={() => (
                    <Button onClick={() => onAddLinkedTask()}>
                        <Icon icon="plus" text="Add" />
                    </Button>
                )} />
        </div>
    );
}

LinkedTaskGrid.propTypes = {
    linkedTasks: PropTypes.arrayOf(LinkedTaskPropType).isRequired,
    updateLinkedTasks: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(LinkedTaskGrid);