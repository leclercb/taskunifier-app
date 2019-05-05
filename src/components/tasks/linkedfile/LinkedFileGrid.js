import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Button, Table } from 'antd';
import withSettings from 'containers/WithSettings';
import { getDefaultLinkedFileFields } from 'data/DataLinkedFileFields';
import { EditableCell, EditableFormRow } from 'components/common/grid/EditableCell';
import ResizableColumn from 'components/common/grid/ResizableColumn';
import { getRenderForType, getWidthForType } from 'utils/FieldUtils';
import { LinkedFilePropType } from 'proptypes/LinkedFilePropTypes';
import { getLinkedFileBackgroundColor } from 'utils/SettingUtils';
import Icon from 'components/common/Icon';
import 'components/common/grid/EditableCell.css';

function LinkedFileGrid(props) {
    const onAddLinkedFile = () => {
        props.updateLinkedFiles([
            ...props.linkedFiles,
            {
                id: uuid(),
                link: null,
                file: null
            }
        ]);
    };

    const onUpdateLinkedFile = linkedFile => {
        const index = props.linkedFiles.findIndex(item => item.id === linkedFile.id);
        const linkedFiles = [...props.linkedFiles];
        linkedFiles[index] = linkedFile;
        props.updateLinkedFiles(linkedFiles);
    };

    const onDeleteLinkedFile = linkedFile => {
        const index = props.linkedFiles.findIndex(item => item.id === linkedFile.id);
        const linkedFiles = [...props.linkedFiles];
        linkedFiles.splice(index, 1);
        props.updateLinkedFiles(linkedFiles);
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
            ['linkedFileColumnWidth_' + field]: size.width
        });
    };

    const linkedFileFields = getDefaultLinkedFileFields();

    const columns = linkedFileFields.map(field => {
        const settingKey = 'linkedFileColumnWidth_' + field.id;
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
                onSave: onUpdateLinkedFile
            })
        };
    });

    let deleteColumnWidth = props.settings['linkedFileColumnWidth_delete'];

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
            <Icon icon="trash-alt" onClick={() => onDeleteLinkedFile(record)} />
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
                dataSource={props.linkedFiles}
                bordered={true}
                size="small"
                pagination={false}
                onRow={(record, index) => ({
                    rowProps: {
                        record: record,
                        onSave: onUpdateLinkedFile,
                        getField: dataIndex => linkedFileFields.find(field => field.id === dataIndex),
                        style: {
                            backgroundColor: getLinkedFileBackgroundColor(record, index, props.settings)
                        }
                    }
                })}
                footer={() => (
                    <Button onClick={() => onAddLinkedFile()}>
                        <Icon icon="plus" text="Add" />
                    </Button>
                )} />
        </div>
    );
}

LinkedFileGrid.propTypes = {
    linkedFiles: PropTypes.arrayOf(LinkedFilePropType.isRequired).isRequired,
    updateLinkedFiles: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(LinkedFileGrid);