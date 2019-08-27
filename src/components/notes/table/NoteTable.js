import React from 'react';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import withNoteFields from 'containers/WithNoteFields';
import withNotes from 'containers/WithNotes';
import withSettings from 'containers/WithSettings';
import withSize from 'containers/WithSize';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import NoteMenu from 'components/notes/table/NoteMenu';
import Constants from 'constants/Constants';
import { getWidthForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { NoteFilterPropType } from 'proptypes/NoteFilterPropTypes';
import { NotePropType } from 'proptypes/NotePropTypes';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { getNoteBackgroundColor } from 'utils/SettingUtils';

function NoteTable(props) {
    const onMenuAction = action => {
        const notes = props.notes.filter(note => props.selectedNoteIds.includes(note.id));

        switch (action.type) {
            case 'remove':
                notes.forEach(note => onRemoveNote(note));
                break;
            default:
                break;
        };
    };

    const onRemoveNote = note => {
        props.deleteNote(note.id);
    };

    const onUpdateNote = note => {
        props.updateNote(note);
    };

    let tableWidth = 0;

    const onResize = resizeHandler('noteColumnWidth_', props.updateSettings);
    const onMove = moveHandler('noteColumnOrder_', props.noteFields, props.settings, props.updateSettings);

    const sortedFields = sortBy(props.noteFields, field => props.settings['noteColumnOrder_' + field.id] || 0);
    const sortedAndFilteredFields = sortedFields.filter(field => props.settings['noteColumnVisible_' + field.id] !== false);

    const columns = sortedAndFilteredFields.map(field => {
        const settingKey = 'noteColumnWidth_' + field.id;
        let width = Number(props.settings[settingKey]);

        if (!width) {
            width = getWidthForType(field.type);
        }

        tableWidth += width + 10;

        return (
            <Column
                key={field.id}
                label={field.title}
                dataKey={field.id}
                width={width}
                flexGrow={0}
                flexShrink={0}
                headerRenderer={data => (
                    <ResizableAndMovableColumn
                        dataKey={data.dataKey}
                        label={data.label}
                        sortBy={data.sortBy}
                        sortDirection={data.sortDirection}
                        onResize={data => onResize(data, field.id, width + data.deltaX)}
                        onMove={(dragColumn, dropColumn) => onMove(dragColumn.dataKey, dropColumn.dataKey)} />
                )}
                cellRenderer={({ cellData, rowData }) => (
                    <CellRenderer
                        field={field}
                        value={cellData}
                        onChange={allValues => onUpdateNote({
                            ...rowData,
                            ...allValues
                        })} />
                )} />
        );
    });

    return (
        <div style={{ overflowY: 'hidden', height: 'calc(100% - 40px)' }}>
            <AutoSizer>
                {({ height }) => (
                    <Table
                        width={tableWidth}
                        height={height}
                        rowHeight={props.settings.noteTableRowHeight}
                        headerHeight={20}
                        rowCount={props.notes.length}
                        rowGetter={({ index }) => props.notes[index]}
                        rowRenderer={rendererProps => (
                            <NoteMenu
                                key={rendererProps.key}
                                selectedNoteIds={props.selectedNoteIds}
                                onAction={onMenuAction}>
                                {defaultTableRowRenderer(rendererProps)}
                            </NoteMenu>
                        )}
                        rowStyle={({ index }) => {
                            const note = props.notes[index];

                            if (!note) {
                                return {};
                            }

                            let foregroundColor = 'initial';
                            let backgroundColor = getNoteBackgroundColor(note, index, props.settings);

                            if (props.selectedNoteIds.includes(note.id)) {
                                foregroundColor = Constants.selectionForegroundColor;
                                backgroundColor = Constants.selectionBackgroundColor;
                            }

                            return {
                                color: foregroundColor,
                                backgroundColor
                            };
                        }}
                        onRowClick={multiSelectionHandler(
                            rowData => rowData.id,
                            props.selectedNoteIds,
                            props.setSelectedNoteIds,
                            false)}
                        onRowRightClick={multiSelectionHandler(
                            rowData => rowData.id,
                            props.selectedNoteIds,
                            props.setSelectedNoteIds,
                            true)} >
                        {columns}
                    </Table>
                )}
            </AutoSizer>
        </div>
    );
}

NoteTable.propTypes = {
    noteFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    notes: PropTypes.arrayOf(NotePropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired,
    selectedNoteFilter: NoteFilterPropType,
    selectedNoteIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setSelectedNoteIds: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
    size: PropTypes.object.isRequired
};

export default withSettings(withNoteFields(withNotes(withSize(NoteTable), { applySelectedNoteFilter: true })));