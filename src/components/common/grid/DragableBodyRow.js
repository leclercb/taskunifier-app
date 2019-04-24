import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import './DragableBodyRow.css';

const BodyRow = props => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moveRow,
        ...restProps
    } = props;

    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;

    if (isOver) {
        className += ' drop-over';
    }

    return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
}

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index
        };
    }
};

const rowTarget = {
    drop: (props, monitor) => {
        const dragIndex = monitor.getItem().index;
        const dropIndex = props.index;

        if (dragIndex === dropIndex) {
            return;
        }

        props.moveRow(dragIndex, dropIndex);
        monitor.getItem().index = dropIndex;
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