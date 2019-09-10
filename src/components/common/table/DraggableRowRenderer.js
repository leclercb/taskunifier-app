import React from 'react';
import PropTypes from 'prop-types';
import DraggableElement from 'components/common/table/DraggableElement';

export function DraggableRowRenderer({
    className,
    columns,
    index,
    onRowClick,
    onRowDoubleClick,
    onRowMouseOut,
    onRowMouseOver,
    onRowRightClick,
    onDrop,
    rowData,
    style,
    dragType,
    dropType
}) {
    const a11yProps = { 'aria-rowindex': index + 1 };

    if (onRowClick ||
        onRowDoubleClick ||
        onRowMouseOut ||
        onRowMouseOver ||
        onRowRightClick) {
        a11yProps['aria-label'] = 'row';
        a11yProps.tabIndex = 0;

        if (onRowClick) {
            a11yProps.onClick = event => onRowClick({ event, index, rowData });
        }
        if (onRowDoubleClick) {
            a11yProps.onDoubleClick = event => onRowDoubleClick({ event, index, rowData });
        }
        if (onRowMouseOut) {
            a11yProps.onMouseOut = event => onRowMouseOut({ event, index, rowData });
        }
        if (onRowMouseOver) {
            a11yProps.onMouseOver = event => onRowMouseOver({ event, index, rowData });
        }
        if (onRowRightClick) {
            a11yProps.onContextMenu = event => onRowRightClick({ event, index, rowData });
        }
    }

    return (
        <DraggableElement
            {...a11yProps}
            className={className}
            role="row"
            style={style}
            dragType={dragType}
            dropType={dropType}
            data={{
                rowIndex: index,
                rowData
            }}
            onDrop={onDrop}>
            {columns}
        </DraggableElement>
    );
}

DraggableRowRenderer.propTypes = {
    className: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowMouseOut: PropTypes.func,
    onRowMouseOver: PropTypes.func,
    onRowRightClick: PropTypes.func,
    onDrop: PropTypes.func.isRequired,
    rowData: PropTypes.object.isRequired,
    style: PropTypes.object,
    dragType: PropTypes.string.isRequired,
    dropType: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    ]).isRequired
};
