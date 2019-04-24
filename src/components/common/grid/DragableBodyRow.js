import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import './DragableBodyRow.css';

const BodyRow = props => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moveRow,
        rowProps,
        ...restProps
    } = props;

    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;

    if (isOver) {
        className += ' drop-over';
    }

    return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
};

const rowSource = {
    beginDrag: props => {
        return {
            record: props.rowProps.record
        };
    }
};

const rowTarget = {
    drop: (props, monitor) => {
        const dragRecord = monitor.getItem().record;
        const dropRecord = props.rowProps.record;

        props.moveRow(dragRecord, dropRecord);
    }
};

const DragableBodyRow = DropTarget(
    'row',
    rowTarget,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    })
)(DragSource(
    'row',
    rowSource,
    (connect) => ({
        connectDragSource: connect.dragSource()
    }),
)(BodyRow));

export default DragableBodyRow;