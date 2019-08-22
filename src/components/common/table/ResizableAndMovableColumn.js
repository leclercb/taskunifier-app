import React from 'react';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import { SortIndicator } from 'react-virtualized';
import DraggableElement from 'components/common/table/DraggableElement';
import { move } from 'utils/ArrayUtils';

export const resizeHandler = (prefix, updateSettings) => (data, fieldId, width) => {
    updateSettings(
        {
            [prefix + fieldId]: width
        },
        {
            skipServerUpdate: !data.stop,
            skipDiff: true
        });
};

export const moveHandler = (prefix, fields, settings, updateSettings) => (dragFieldId, dropFieldId) => {
    const updatedSettings = {};

    const array = sortBy(fields, field => settings[prefix + field.id] || 0).map(field => field.id);
    move(array, array.indexOf(dragFieldId), array.indexOf(dropFieldId));

    array.forEach((fieldId, index) => {
        updatedSettings[prefix + fieldId] = index;
    });

    updateSettings(updatedSettings);
};

export function ResizableAndMovableColumn(props) {
    const showSortIndicator = sortBy === props.dataKey;

    return (
        <React.Fragment key={props.dataKey}>
            <DraggableElement
                dragType="column"
                dropType="column"
                data={{
                    dataKey: props.dataKey,
                    label: props.label
                }}
                onDrop={(dragData, dropData) => props.onMove(dragData, dropData)}
                className="ReactVirtualized__Table__headerTruncatedText">
                {props.label}
            </DraggableElement>
            {showSortIndicator ? (
                <SortIndicator key="SortIndicator" sortDirection={props.sortDirection} />
            ) : null}
            <Draggable
                axis="x"
                defaultClassName="DragHandle"
                defaultClassNameDragging="DragHandleActive"
                onDrag={(event, data) => props.onResize({ ...data, stop: false })}
                onStop={(event, data) => props.onResize({ ...data, stop: true })}
                position={{ x: 0 }}
                zIndex={999}>
                <span className="DragHandleIcon">⋮</span>
            </Draggable>
        </React.Fragment>
    );
}

ResizableAndMovableColumn.propTypes = {
    dataKey: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    onResize: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired
};
