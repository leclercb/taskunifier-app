import React, { useEffect, useRef } from 'react';
import sortBy from 'lodash/sortBy';
import { ArrowKeyStepper, AutoSizer, MultiGrid } from 'react-virtualized';
import PropTypes from 'prop-types';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import NoteMenu from 'components/notes/table/NoteMenu';
import Constants from 'constants/Constants';
import withBusyCheck from 'containers/WithBusyCheck';
import { getWidthForType, isAlwaysInEditionForType } from 'data/DataFieldTypes';
import { useAppApi } from 'hooks/UseAppApi';
import { useEditingCellApi } from 'hooks/UseEditingCellApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useNoteApi } from 'hooks/UseNoteApi';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';
import { getNoteBackgroundColor, getNoteForegroundColor } from 'utils/SettingUtils';
import 'components/notes/table/NoteTable.css';

function NoteTable({ apis }) {
    const { appApi, editingCellApi, noteApi, noteFieldApi, settingsApi } = apis;

    const gridRef = useRef();

    const dataSource = noteApi.filteredNotes;

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.recomputeGridSize();
        }
    }, [appApi.dataUuid]);

    const onUpdateNote = note => {
        noteApi.updateNote(note);
    };

    const onResize = resizeHandler('noteColumnWidth_', settingsApi.updateSettings);
    const onMove = moveHandler('noteColumnOrder_', noteFieldApi.noteFields, settingsApi.settings, settingsApi.updateSettings);

    const sortedFields = sortBy(noteFieldApi.noteFields, field => ('noteColumnOrder_' + field.id) in settingsApi.settings ? settingsApi.settings['noteColumnOrder_' + field.id] : field.defaultOrder || 0);
    const sortedAndFilteredFields = sortedFields.filter(field => settingsApi.settings['noteColumnVisible_' + field.id] !== false);

    const getColumnWidth = columnIndex => {
        const field = sortedAndFilteredFields[columnIndex];
        const settingKey = 'noteColumnWidth_' + field.id;
        let width = Number(settingsApi.settings[settingKey]);

        if (!width || width < 10) {
            width = getWidthForType(field.type);
        }

        return width;
    };

    let totalWidth = 0;

    sortedAndFilteredFields.forEach((field, index) => {
        totalWidth += getColumnWidth(index);
    });

    const getCellRenderer = ({ columnIndex, rowIndex }) => { // eslint-disable-line react/prop-types
        const field = sortedAndFilteredFields[columnIndex];

        if (rowIndex === 0) {
            return (
                <ResizableAndMovableColumn
                    dataKey={field.id}
                    label={(<strong>{field.title}</strong>)}
                    onResize={async data => {
                        await onResize(data, field.id, getColumnWidth(columnIndex) + data.deltaX);

                        if (gridRef.current && data.stop) {
                            gridRef.current.recomputeGridSize();
                        }
                    }}
                    onMove={async (dragColumn, dropColumn) => {
                        await onMove(dragColumn.dataKey, dropColumn.dataKey);
                        gridRef.current.recomputeGridSize();
                    }} />
            );
        }

        const rowData = dataSource[rowIndex - 1];
        const cellData = rowData[field.id];

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
            <NoteMenu selectedNotes={noteApi.selectedNotes}>
                <CellRenderer
                    record={rowData}
                    field={field}
                    value={cellData}
                    onChange={allValues => {
                        noteApi.setSelectedNoteIds(rowData.id);
                        return onUpdateNote({
                            ...rowData,
                            ...allValues
                        });
                    }}
                    {...dndProps} />
            </NoteMenu>
        );
    };

    let scrollToIndex = undefined;

    if (noteApi.selectedNoteIds.length === 1) {
        const index = dataSource.findIndex(note => note.id === noteApi.selectedNoteIds[0]);

        if (index >= 0) {
            scrollToIndex = index;
        }
    }

    if (editingCellApi.editingCell) {
        const index = dataSource.findIndex(note => note.id === editingCellApi.editingCell.objectId);

        if (index >= 0) {
            scrollToIndex = index;
        }
    }

    return (
        <div
            className="joyride-note-table"
            style={{ height: 'calc(100% - 40px)' }}>
            <AutoSizer>
                {({ width, height }) => (
                    <ArrowKeyStepper
                        columnCount={sortedAndFilteredFields.length}
                        rowCount={dataSource.length + 1}
                        mode="cells"
                        isControlled={true}
                        disabled={scrollToIndex === undefined}
                        scrollToRow={scrollToIndex !== undefined ? scrollToIndex + 1 : undefined}
                        onScrollToChange={({ scrollToRow }) => noteApi.setSelectedNoteIds(dataSource[scrollToRow - 1].id)}>
                        {({ onSectionRendered }) => (
                            <MultiGrid
                                ref={gridRef}
                                width={width}
                                height={height}
                                scrollToRow={scrollToIndex ? scrollToIndex + 1 : undefined}
                                onSectionRendered={onSectionRendered}
                                columnCount={sortedAndFilteredFields.length}
                                columnWidth={({ index }) => getColumnWidth(index)}
                                estimatedColumnSize={totalWidth / sortedAndFilteredFields.length}
                                fixedColumnCount={0}
                                rowHeight={settingsApi.settings.noteTableRowHeight}
                                rowCount={dataSource.length + 1}
                                fixedRowCount={1}
                                cellRenderer={({ columnIndex, rowIndex, key, style }) => {
                                    const note = dataSource[rowIndex - 1];
                                    const classNames = [];

                                    if (note && noteApi.selectedNoteIds.includes(note.id)) {
                                        classNames.push('note-selected');
                                    }

                                    style = {
                                        ...style,
                                        padding: '0px 5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    };

                                    if (note) {
                                        let foregroundColor = getNoteForegroundColor();
                                        let backgroundColor = getNoteBackgroundColor(note, rowIndex - 1, settingsApi.settings);

                                        if (noteApi.selectedNoteIds.includes(note.id)) {
                                            foregroundColor = Constants.selectionForegroundColor;
                                            backgroundColor = Constants.selectionBackgroundColor;
                                        }

                                        style.color = foregroundColor;
                                        style.backgroundColor = backgroundColor;
                                    }

                                    const onClick = (event, rightClick) => {
                                        if (note) {
                                            multiSelectionHandler(
                                                rowData => rowData.id,
                                                dataSource,
                                                noteApi.selectedNoteIds,
                                                noteApi.setSelectedNoteIds,
                                                rightClick)({ event, rowData: note });
                                        }
                                    };

                                    const onDoubleClick = async () => {
                                        if (note) {
                                            noteApi.setSelectedNoteIds(note.id);
                                        } else {
                                            const field = sortedAndFilteredFields[columnIndex];
                                            await onResize({ stop: true }, field.id, getWidthForType(field.type));

                                            if (gridRef.current) {
                                                gridRef.current.recomputeGridSize();
                                            }
                                        }
                                    };

                                    return (
                                        <div
                                            key={key}
                                            style={style}
                                            className={classNames.join(' ')}
                                            onClick={event => onClick(event, false)}
                                            onDoubleClick={onDoubleClick}
                                            onContextMenu={event => onClick(event, true)}>
                                            {getCellRenderer({ columnIndex, rowIndex })}
                                        </div>
                                    );
                                }} />
                        )}
                    </ArrowKeyStepper>
                )}
            </AutoSizer>
        </div>
    );
}

NoteTable.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(NoteTable, () => ({
    appApi: useAppApi(),
    editingCellApi: useEditingCellApi(),
    noteApi: useNoteApi(),
    noteFieldApi: useNoteFieldApi(),
    settingsApi: useSettingsApi()
}));