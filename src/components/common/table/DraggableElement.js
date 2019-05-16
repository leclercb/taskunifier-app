import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

function DndWrapper(props) {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        ...restProps
    } = props;

    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;

    if (isOver) {
        className += ' DropOver';
    }

    delete restProps.dropType;
    delete restProps.dragType;
    delete restProps.data;
    delete restProps.onDrop;

    return connectDragSource(connectDropTarget(<div {...restProps} className={className} style={style} />));
}

DndWrapper.propTypes = {
    dropType: PropTypes.string.isRequired,
    dragType: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    onDrop: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired
};

const source = {
    beginDrag: props => {
        return {
            data: props.data
        };
    }
};

const target = {
    drop: (props, monitor) => {
        const dragData = monitor.getItem().data;
        const dropData = props.data;

        props.onDrop(dragData, dropData);
    }
};

const dropTarget = DropTarget(
    props => props.dropType,
    target,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    })
);

const dragSource = DragSource(
    props => props.dragType,
    source,
    (connect) => ({
        connectDragSource: connect.dragSource()
    })
);

const DraggableElement = dropTarget(dragSource(DndWrapper));

export default DraggableElement;