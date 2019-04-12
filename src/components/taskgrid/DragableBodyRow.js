import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import './DragableBodyRow.css';

let dragingIndex = -1;

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
        if (restProps.index > dragingIndex) {
            className += ' drop-over-downward';
        }

        if (restProps.index < dragingIndex) {
            className += ' drop-over-upward';
        }
    }

    return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
}

const rowSource = {
    beginDrag(props) {
        dragingIndex = props.index;
        return {
            index: props.index,
        };
    }
};

const rowTarget = {
    drop: (props, monitor) => {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }

        props.moveRow(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget(
    'row',
    rowTarget,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    })
)(
    DragSource(
        'row',
        rowSource,
        (connect) => ({
            connectDragSource: connect.dragSource()
        }),
    )(BodyRow)
);

export default DragableBodyRow;