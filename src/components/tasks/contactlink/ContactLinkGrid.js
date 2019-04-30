import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Button, Table } from 'antd';
import withSettings from 'containers/WithSettings';
import { getDefaultContactLinkFields } from 'data/DataContactLinkFields';
import { EditableCell, EditableFormRow } from 'components/common/grid/EditableCell';
import ResizableColumn from 'components/common/grid/ResizableColumn';
import { getRenderForType, getWidthForType } from 'utils/FieldUtils';
import { ContactLinkPropType } from 'proptypes/ContactLinkPropTypes';
import { getContactLinkBackgroundColor } from 'utils/SettingUtils';
import '../../common/grid/EditableCell.css';
import Icon from 'components/common/Icon';

function ContactLinkGrid(props) {
    const onAddContactLink = () => {
        props.updateContactLinks([
            ...props.contactLinks,
            {
                id: uuid(),
                contact: null,
                link: null
            }
        ])
    }

    const onUpdateContactLink = contactLink => {
        const index = props.contactLinks.findIndex(item => item.id === contactLink.id);
        const contactLinks = [...props.contactLinks];
        contactLinks[index] = contactLink;
        props.updateContactLinks(contactLinks);
    };

    const onDeleteContactLink = contactLink => {
        const index = props.contactLinks.findIndex(item => item.id === contactLink.id);
        const contactLinks = [...props.contactLinks];
        contactLinks.splice(index, 1);
        props.updateContactLinks(contactLinks);
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
            ['contactLinkColumnWidth_' + field]: size.width
        });
    };

    const contactLinkFields = getDefaultContactLinkFields();

    const columns = contactLinkFields.map(field => {
        const settingKey = 'contactLinkColumnWidth_' + field.id;
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
                onSave: onUpdateContactLink
            })
        };
    });

    let deleteColumnWidth = props.settings['contactLinkColumnWidth_delete'];

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
            <Icon icon="trash-alt" onClick={() => onDeleteContactLink(record)} />
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
                dataSource={props.contactLinks}
                bordered={true}
                size="small"
                pagination={false}
                onRow={(record, index) => ({
                    rowProps: {
                        record: record,
                        onSave: onUpdateContactLink,
                        getField: dataIndex => contactLinkFields.find(field => field.id === dataIndex),
                        style: {
                            backgroundColor: getContactLinkBackgroundColor(record, index, props.settings)
                        }
                    }
                })}
                footer={() => (
                    <Button onClick={() => onAddContactLink()}>
                        <Icon icon="plus" text="Add" />
                    </Button>
                )} />
        </div>
    );
}

ContactLinkGrid.propTypes = {
    contactLinks: PropTypes.arrayOf(ContactLinkPropType).isRequired,
    updateContactLinks: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(ContactLinkGrid);