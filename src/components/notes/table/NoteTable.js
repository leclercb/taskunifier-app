import React from 'react';
import sortBy from 'lodash/sortBy';
import { AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import NoteMenu from 'components/notes/table/NoteMenu';
import Constants from 'constants/Constants';
import { getWidthForType, isAlwaysInEditionForType } from 'data/DataFieldTypes';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';
import { useNoteApi } from 'hooks/UseNoteApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { getNoteBackgroundColor } from 'utils/SettingUtils';

function NoteTable() {
    const noteApi = useNoteApi();
    const noteFieldApi = useNoteFieldApi();
    const settingsApi = useSettingsApi();

    const onMenuAction = action => {
        const notes = noteApi.selectedNotes;

        switch (action.type) {
            case 'duplicate':
                notes.forEach(note => onDuplicateNote(note));
                break;
            case 'remove':
                onRemoveNotes(notes.map(note => note.id));
                break;
            default:
                break;
        }
    };

    const onDuplicateNote = note => {
        noteApi.duplicateNote(note);
    };

    const onRemoveNotes = noteIds => {
        noteApi.deleteNote(noteIds);
    };

    const onUpdateNote = note => {
        noteApi.updateNote(note);
    };

    let tableWidth = 0;

    const onResize = resizeHandler('noteColumnWidth_', settingsApi.updateSettings);
    const onMove = moveHandler('noteColumnOrder_', noteFieldApi.noteFields, settingsApi.settings, settingsApi.updateSettings);

    const sortedFields = sortBy(noteFieldApi.noteFields, field => settingsApi.settings['noteColumnOrder_' + field.id] || 0);
    const sortedAndFilteredFields = sortedFields.filter(field => settingsApi.settings['noteColumnVisible_' + field.id] !== false);

    const columns = sortedAndFilteredFields.map(field => {
        const settingKey = 'noteColumnWidth_' + field.id;
        let width = Number(settingsApi.settings[settingKey]);

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
                cellRenderer={({ cellData, rowData }) => {
                    let dndProps = {};

                    if (!isAlwaysInEditionForType(field.type)) {
                        dndProps = {
                            dndEnabled: true,
                            dragType: 'note',
                            dropType: [],
                            dndData: {
                                object: rowData,
                                rowData
                            }
                        };
                    }

                    return (
                        <CellRenderer
                            record={rowData}
                            field={field}
                            value={cellData}
                            onChange={allValues => onUpdateNote({
                                ...rowData,
                                ...allValues
                            })}
                            {...dndProps} />
                    );
                }} />
        );
    });

    return (
        <div style={{ overflowY: 'hidden', height: 'calc(100% - 40px)' }}>
            <AutoSizer>
                {({ height }) => (
                    <Table
                        width={tableWidth}
                        height={height}
                        rowHeight={settingsApi.settings.noteTableRowHeight}
                        headerHeight={20}
                        rowCount={noteApi.filteredNotes.length}
                        rowGetter={({ index }) => noteApi.filteredNotes[index]}
                        rowRenderer={rendererProps => (
                            <NoteMenu
                                key={rendererProps.key}
                                selectedNoteIds={noteApi.selectedNoteIds}
                                onAction={onMenuAction}>
                                {defaultTableRowRenderer(rendererProps)}
                            </NoteMenu>
                        )}
                        rowStyle={({ index }) => {
                            const note = noteApi.filteredNotes[index];

                            if (!note) {
                                return {};
                            }

                            let foregroundColor = 'initial';
                            let backgroundColor = getNoteBackgroundColor(note, index, settingsApi.settings);

                            if (noteApi.selectedNoteIds.includes(note.id)) {
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
                            noteApi.filteredNotes,
                            noteApi.selectedNoteIds,
                            noteApi.setSelectedNoteIds,
                            false)}
                        onRowRightClick={multiSelectionHandler(
                            rowData => rowData.id,
                            noteApi.filteredNotes,
                            noteApi.selectedNoteIds,
                            noteApi.setSelectedNoteIds,
                            true)} >
                        {columns}
                    </Table>
                )}
            </AutoSizer>
        </div>
    );
}

export default NoteTable;