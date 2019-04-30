import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Button, Table } from 'antd';
import withSettings from 'containers/WithSettings';
import { getDefaultLinkedContactFields } from 'data/DataLinkedContactFields';
import { EditableCell, EditableFormRow } from 'components/common/grid/EditableCell';
import ResizableColumn from 'components/common/grid/ResizableColumn';
import { getRenderForType, getWidthForType } from 'utils/FieldUtils';
import { LinkedContactPropType } from 'proptypes/LinkedContactPropTypes';
import { getLinkedContactBackgroundColor } from 'utils/SettingUtils';
import '../../common/grid/EditableCell.css';
import Icon from 'components/common/Icon';

function LinkedContactGrid(props) {
    const onAddLinkedContact = () => {
        props.updateLinkedContacts([
            ...props.linkedContacts,
            {
                id: uuid(),
                link: null,
                contact: null
            }
        ]);
    };

    const onUpdateLinkedContact = linkedContact => {
        const index = props.linkedContacts.findIndex(item => item.id === linkedContact.id);
        const linkedContacts = [...props.linkedContacts];
        linkedContacts[index] = linkedContact;
        props.updateLinkedContacts(linkedContacts);
    };

    const onDeleteLinkedContact = linkedContact => {
        const index = props.linkedContacts.findIndex(item => item.id === linkedContact.id);
        const linkedContacts = [...props.linkedContacts];
        linkedContacts.splice(index, 1);
        props.updateLinkedContacts(linkedContacts);
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
            ['linkedContactColumnWidth_' + field]: size.width
        });
    };

    const linkedContactFields = getDefaultLinkedContactFields();

    const columns = linkedContactFields.map(field => {
        const settingKey = 'linkedContactColumnWidth_' + field.id;
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
                onSave: onUpdateLinkedContact
            })
        };
    });

    let deleteColumnWidth = props.settings['linkedContactColumnWidth_delete'];

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
            <Icon icon="trash-alt" onClick={() => onDeleteLinkedContact(record)} />
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
                dataSource={props.linkedContacts}
                bordered={true}
                size="small"
                pagination={false}
                onRow={(record, index) => ({
                    rowProps: {
                        record: record,
                        onSave: onUpdateLinkedContact,
                        getField: dataIndex => linkedContactFields.find(field => field.id === dataIndex),
                        style: {
                            backgroundColor: getLinkedContactBackgroundColor(record, index, props.settings)
                        }
                    }
                })}
                footer={() => (
                    <Button onClick={() => onAddLinkedContact()}>
                        <Icon icon="plus" text="Add" />
                    </Button>
                )} />
        </div>
    );
}

LinkedContactGrid.propTypes = {
    linkedContacts: PropTypes.arrayOf(LinkedContactPropType).isRequired,
    updateLinkedContacts: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(LinkedContactGrid);