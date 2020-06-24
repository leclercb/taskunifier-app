import React, { useState } from 'react';
import { Button, Empty } from 'antd';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Column, Table } from 'react-virtualized';
import { v4 as uuid } from 'uuid';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import Constants from 'constants/Constants';
import { getWidthForType, isAlwaysInEditionForType } from 'data/DataFieldTypes';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { TimeDurationPropType } from 'proptypes/TimeDurationPropTypes';
import { move } from 'utils/ArrayUtils';
import { clone } from 'utils/ObjectUtils';
import { getTimeDurationBackgroundColor } from 'utils/SettingUtils';

function TimeDurationTable(props) {
    const settingsApi = useSettingsApi();
    const [selectedTimeDurationIds, setSelectedTimeDurationIds] = useState([]);

    const onAddTimeDuration = () => {
        props.updateTimeDurations([
            ...props.timeDurations,
            {
                id: uuid(),
                amount: 1,
                unit: 'day'
            }
        ]);
    };

    const onUpdateTimeDuration = timeDuration => {
        const index = props.timeDurations.findIndex(item => item.id === timeDuration.id);
        const timeDurations = [...props.timeDurations];
        timeDurations[index] = timeDuration;
        props.updateTimeDurations(timeDurations);
    };

    const onDeleteTimeDurations = timeDurationIds => {
        const timeDurations = props.timeDurations.filter(timeDuration => !timeDurationIds.includes(timeDuration.id));
        props.updateTimeDurations(timeDurations);
    };

    const onDropTimeDuration = (dragData, dropData) => {
        const timeDurations = [...props.timeDurations];
        move(timeDurations, dragData.rowIndex, dropData.rowIndex);
        props.updateTimeDurations(timeDurations);
    };

    let tableWidth = 0;

    const onResize = resizeHandler(props.widthSettingPrefix, settingsApi.updateSettings);
    const onMove = moveHandler(props.orderSettingPrefix, props.timeDurationFields, settingsApi.settings, settingsApi.updateSettings);

    const columns = sortBy(props.timeDurationFields, field => settingsApi.settings[props.orderSettingPrefix + field.id] || 0).map(field => {
        if (props.disabled) {
            field = clone(field);
            field.editable = false;
        }

        const settingKey = props.widthSettingPrefix + field.id;
        let width = Number(settingsApi.settings[settingKey]);

        if (!width || width < 10) {
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
                            dndEnabled: !props.disabled,
                            dragType: 'timeDuration',
                            dropType: 'timeDuration',
                            dndData: {
                                object: rowData,
                                rowData,
                                rowIndex
                            },
                            onDrop: onDropTimeDuration
                        };
                    }

                    return (
                        <CellRenderer
                            record={rowData}
                            field={field}
                            value={cellData}
                            onChange={allValues => onUpdateTimeDuration({
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
            {props.timeDurations.length === 0 && (
                <Empty description={'No time duration, click on the "Add" button to add your first time duration !'} />
            )}
            {props.timeDurations.length > 0 && (
                <Table
                    width={tableWidth}
                    height={150}
                    rowHeight={28}
                    headerHeight={20}
                    rowCount={props.timeDurations.length}
                    rowGetter={({ index }) => props.timeDurations[index]}
                    rowStyle={({ index }) => {
                        const timeDuration = props.timeDurations[index];

                        if (!timeDuration) {
                            return {};
                        }

                        let foregroundColor = 'initial';
                        let backgroundColor = getTimeDurationBackgroundColor(timeDuration, index, settingsApi.settings);

                        if (selectedTimeDurationIds.includes(timeDuration.id)) {
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
                        props.timeDurations,
                        selectedTimeDurationIds,
                        setSelectedTimeDurationIds)} >
                    {columns}
                </Table>
            )}
            {!props.disabled && (
                <div style={{ marginTop: 10 }}>
                    <Button onClick={() => onAddTimeDuration()}>
                        <Icon icon="plus" text="Add" />
                    </Button>
                    <Spacer />
                    <Button
                        onClick={() => onDeleteTimeDurations(selectedTimeDurationIds)}
                        disabled={selectedTimeDurationIds.length === 0}>
                        <Icon icon="trash-alt" text="Delete" />
                    </Button>
                </div>
            )}
        </React.Fragment>
    );
}

TimeDurationTable.propTypes = {
    timeDurations: PropTypes.arrayOf(TimeDurationPropType.isRequired).isRequired,
    timeDurationFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    updateTimeDurations: PropTypes.func,
    orderSettingPrefix: PropTypes.string.isRequired,
    widthSettingPrefix: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

export default TimeDurationTable;