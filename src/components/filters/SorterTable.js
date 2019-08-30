import React, { useState } from 'react';
import { Button, Empty } from 'antd';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Column, Table } from 'react-virtualized';
import uuid from 'uuid/v4';
import Spacer from 'components/common/Spacer';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import Constants from 'constants/Constants';
import withSettings from 'containers/WithSettings';
import { getWidthForType, isAlwaysInEditionForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { SorterPropType } from 'proptypes/SorterPropTypes';
import { move } from 'utils/ArrayUtils';
import { getSorterBackgroundColor } from 'utils/SettingUtils';

function SorterTable(props) {
    const [selectedSorterIds, setSelectedSorterIds] = useState([]);

    const onAddSorter = () => {
        props.updateSorters([
            ...props.sorters,
            {
                id: uuid(),
                field: null,
                direction: 'ascending'
            }
        ]);
    };

    const onUpdateSorter = sorter => {
        const index = props.sorters.findIndex(item => item.id === sorter.id);
        const sorters = [...props.sorters];
        sorters[index] = sorter;
        props.updateSorters(sorters);
    };

    const onDeleteSorters = sorterIds => {
        const sorters = props.sorters.filter(sorter => !sorterIds.includes(sorter.id));
        props.updateSorters(sorters);
    };

    const onDropSorter = (dragData, dropData) => {
        const sorters = [...props.sorters];
        move(sorters, dragData.rowIndex, dropData.rowIndex);
        props.updateSorters(sorters);
    };

    let tableWidth = 0;

    const onResize = resizeHandler(props.widthSettingPrefix, props.updateSettings);
    const onMove = moveHandler(props.orderSettingPrefix, props.sorterFields, props.settings, props.updateSettings);

    const columns = sortBy(props.sorterFields, field => props.settings[props.orderSettingPrefix + field.id] || 0).map(field => {
        const settingKey = props.widthSettingPrefix + field.id;
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
                cellRenderer={({ cellData, rowData, rowIndex }) => {
                    let dndProps = {};

                    if (!isAlwaysInEditionForType(field.type)) {
                        dndProps = {
                            dndEnabled: true,
                            dragType: 'sorter',
                            dropType: 'sorter',
                            dndData: {
                                rowData,
                                rowIndex
                            },
                            onDrop: onDropSorter
                        };
                    }

                    return (
                        <CellRenderer
                            field={field}
                            value={cellData}
                            onChange={allValues => onUpdateSorter({
                                ...rowData,
                                ...allValues
                            })}
                            {...dndProps} />
                    );
                }} />
        );
    });

    return (
        <React.Fragment>
            {props.sorters.length === 0 && (
                <Empty description={'No sorter, click on the "Add" button to add your first sorter !'} />
            )}
            {props.sorters.length > 0 && (
                <Table
                    width={tableWidth}
                    height={150}
                    rowHeight={32}
                    headerHeight={20}
                    rowCount={props.sorters.length}
                    rowGetter={({ index }) => props.sorters[index]}
                    rowStyle={({ index }) => {
                        const sorter = props.sorters[index];

                        if (!sorter) {
                            return {};
                        }

                        let foregroundColor = 'initial';
                        let backgroundColor = getSorterBackgroundColor(sorter, index, props.settings);

                        if (selectedSorterIds.includes(sorter.id)) {
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
                        props.sorters,
                        selectedSorterIds,
                        setSelectedSorterIds)} >
                    {columns}
                </Table>
            )}
            <div style={{ marginTop: 10 }}>
                <Button onClick={() => onAddSorter()}>
                    Add
                </Button>
                <Spacer />
                <Button onClick={() => onDeleteSorters(selectedSorterIds)}>
                    Delete
                </Button>
            </div>
        </React.Fragment>
    );
}

SorterTable.propTypes = {
    sorters: PropTypes.arrayOf(SorterPropType.isRequired).isRequired,
    sorterFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    updateSorters: PropTypes.func.isRequired,
    settings: SettingsPropType.isRequired,
    updateSettings: PropTypes.func.isRequired,
    orderSettingPrefix: PropTypes.string.isRequired,
    widthSettingPrefix: PropTypes.string.isRequired
};

export default withSettings(SorterTable);