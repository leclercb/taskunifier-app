import React from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';

function DraggableElement(props) {
    // eslint-disable-next-line no-unused-vars
    const [collectedDragProps, drag] = useDrag({
        item: {
            type: props.dragType,
            data: props.data
        }
    });

    const [collectedDropProps, drop] = useDrop({
        accept: props.dropType,
        drop: item => props.onDrop ? props.onDrop(item.data, props.data) : null,
        collect: monitor => ({
            hovered: monitor.isOver()
        })
    });

    const { ...restProps } = props;

    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;

    if (collectedDropProps.hovered) {
        className += ' DropOver';
    }

    delete restProps.dropType;
    delete restProps.dragType;
    delete restProps.data;
    delete restProps.onDrop;
    delete restProps.children;

    return (
        <div
            {...restProps}
            className={className}
            style={style}>
            <div ref={drag}>
                <div ref={drop}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}

DraggableElement.propTypes = {
    children: PropTypes.node.isRequired,
    dragType: PropTypes.string.isRequired,
    dropType: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    ]).isRequired,
    data: PropTypes.object.isRequired,
    onDrop: PropTypes.func
};

export default DraggableElement;