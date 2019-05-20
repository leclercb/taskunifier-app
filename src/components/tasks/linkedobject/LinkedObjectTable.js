import React, { useState } from 'react';
import { Button } from 'antd';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { AutoSizer, Column, Table } from 'react-virtualized';
import uuid from 'uuid';
import Spacer from 'components/common/Spacer';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import withSettings from 'containers/WithSettings';
import { getWidthForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { LinkedObjectPropType } from 'proptypes/LinkedObjectPropTypes';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { getLinkedObjectBackgroundColor } from 'utils/SettingUtils';

function LinkedObjectTable(props) {
    const [selectedLinkedObjectIds, setSelectedLinkedObjectIds] = useState([]);

    const { linkedObjectFields } = props;

    const onAddLinkedObject = () => {
        props.updateLinkedObjects([
            ...props.linkedObjects,
            {
                id: uuid(),
                link: null
            }
        ]);
    };

    const onUpdateLinkedObject = linkedObject => {
        const index = props.linkedObjects.findIndex(item => item.id === linkedObject.id);
        const linkedObjects = [...props.linkedObjects];
        linkedObjects[index] = linkedObject;
        props.updateLinkedObjects(linkedObjects);
    };

    const onDeleteLinkedObjects = linkedObjectIds => {
        const linkedObjects = props.linkedObjects.filter(linkedObject => !linkedObjectIds.includes(linkedObject.id));
        props.updateLinkedObjects(linkedObjects);
    };

    let tableWidth = 0;

    const onResize = resizeHandler(props.widthSettingPrefix, props.updateSettings);
    const onMove = moveHandler(props.orderSettingPrefix, linkedObjectFields, props.settings, props.updateSettings);

    const columns = sortBy(linkedObjectFields, field => props.settings[props.orderSettingPrefix + field.id] || 0).map(field => {
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
                        onResize={({ deltaX }) => onResize(field.id, width + deltaX)}
                        onMove={(dragColumn, dropColumn) => onMove(dragColumn.dataKey, dropColumn.dataKey)} />
                )}
                cellRenderer={({ cellData, rowData }) => (
                    <CellRenderer
                        field={field}
                        value={cellData}
                        onChange={allValues => onUpdateLinkedObject({
                            ...rowData,
                            ...allValues
                        })} />
                )} />
        );
    });

    return (
        <React.Fragment>
            <div style={{ overflowY: 'hidden', height: 'calc(100% - 50px)' }}>
                <AutoSizer>
                    {({ height }) => (
                        <Table
                            width={tableWidth}
                            height={height}
                            rowHeight={38}
                            headerHeight={20}
                            rowCount={props.linkedObjects.length}
                            rowGetter={({ index }) => props.linkedObjects[index]}
                            rowStyle={({ index }) => {
                                const linkedObject = props.linkedObjects[index];

                                if (!linkedObject) {
                                    return {};
                                }

                                let backgroundColor = getLinkedObjectBackgroundColor(linkedObject, index, props.settings);

                                if (selectedLinkedObjectIds.includes(linkedObject.id)) {
                                    backgroundColor = '#b8ccbf';
                                }

                                return {
                                    backgroundColor
                                };
                            }}
                            onRowClick={multiSelectionHandler(
                                rowData => rowData.id,
                                selectedLinkedObjectIds,
                                setSelectedLinkedObjectIds)} >
                            {columns}
                        </Table>
                    )}
                </AutoSizer>
            </div>
            <div style={{ marginTop: 10 }}>
                <Button onClick={() => onAddLinkedObject()}>
                    Add
                </Button>
                <Spacer />
                <Button onClick={() => onDeleteLinkedObjects(selectedLinkedObjectIds)}>
                    Delete
                </Button>
            </div>
        </React.Fragment>
    );
}

LinkedObjectTable.propTypes = {
    linkedObjectFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    linkedObjects: PropTypes.arrayOf(LinkedObjectPropType.isRequired).isRequired,
    updateLinkedObjects: PropTypes.func.isRequired,
    settings: SettingsPropType.isRequired,
    updateSettings: PropTypes.func.isRequired,
    orderSettingPrefix: PropTypes.string.isRequired,
    widthSettingPrefix: PropTypes.string.isRequired
};

export default withSettings(LinkedObjectTable);