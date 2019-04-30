import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import withSettings from 'containers/WithSettings';
import { getDefaultContactLinkFields } from 'data/DataContactLinkFields';
import { EditableCell, EditableFormRow } from 'components/common/grid/EditableCell';
import ResizableColumn from 'components/common/grid/ResizableColumn';
import { getRenderForType, getWidthForType } from 'utils/FieldUtils';
import { ContactLinkPropType } from 'proptypes/ContactLinkPropTypes';
import '../../common/grid/EditableCell.css';

function ContactLinkGrid(props) {
    const onUpdateContactLink = contactLink => {
        console.log(contactLink);
        //props.updateContactLinks(contactLink);
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
                onRow={record => ({
                    rowProps: {
                        record: record,
                        onSave: onUpdateContactLink,
                        getField: dataIndex => contactLinkFields.find(field => field.id === dataIndex),
                        style: {}
                    }
                })} />
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