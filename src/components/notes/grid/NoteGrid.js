import React from 'react';
import PropTypes from 'prop-types';
import { InfinityTable } from 'antd-table-infinity';
import withApp from 'containers/WithApp';
import withNoteFields from 'containers/WithNoteFields';
import withNotes from 'containers/WithNotes';
import withSettings from 'containers/WithSettings';
import { EditableCell, EditableFormRow } from 'components/common/grid/EditableCell';
import ResizableColumn from 'components/common/grid/ResizableColumn';
import { getRenderForType, getWidthForType } from 'utils/FieldUtils';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { NotePropType } from 'proptypes/NotePropTypes';
import { getNoteBackgroundColor } from 'utils/SettingUtils';
import '../../common/grid/EditableCell.css';

function NoteGrid(props) {
    const onUpdateNote = note => {
        props.updateNote(note);
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
            ['noteColumnWidth_' + field]: size.width
        });
    };

    const columns = props.noteFields.map(field => {
        const settingKey = 'noteColumnWidth_' + field.id;
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
                onSave: onUpdateNote
            })
        };
    });

    const dummy = false;

    return (
        <div style={{ overflowY: 'auto', height: 'calc(100% - 40px)' }}>
            <InfinityTable
                rowKey="id"
                className="data-grid"
                rowClassName={() => 'editable-row'}
                scroll={{ y: 500 }}
                components={components}
                columns={columns}
                dataSource={dummy ? dummyNotes : props.notes}
                bordered={true}
                size="small"
                pagination={false}
                onRow={(record, index) => ({
                    rowProps: {
                        record: record,
                        onSave: onUpdateNote,
                        getField: dataIndex => props.noteFields.find(field => field.id === dataIndex),
                        style: {
                            backgroundColor: getNoteBackgroundColor(record, index, props.settings)
                        }
                    }
                })}
                rowSelection={{
                    selectedRowKeys: props.selectedNoteIds,
                    onChange: selectedRowKeys => props.setSelectedNoteIds(selectedRowKeys)
                }} />
        </div>
    );
}

NoteGrid.propTypes = {
    noteFields: PropTypes.arrayOf(FieldPropType).isRequired,
    notes: PropTypes.arrayOf(NotePropType).isRequired,
    settings: PropTypes.object.isRequired,
    selectedNoteIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setSelectedNoteIds: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired
};

// TODO remove
const dummyNotes = createDummyNotes();

function createDummyNotes() {
    const notes = [];

    for (let i = 0; i < 1000; i++) {
        notes.push({
            id: 'note-dummy-' + i,
            refIds: {},
            creationDate: 1554795588054,
            updateDate: 1554897001063,
            state: 'TO_UPDATE',
            title: 'Note Dummy ' + i,
            color: '#ffffff'
        });
    }

    return notes;
}

export default withApp(withSettings(withNoteFields(withNotes(NoteGrid, { applySelectedNoteFilter: true }))));