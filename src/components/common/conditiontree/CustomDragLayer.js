import React from 'react';
import { DragLayer } from 'react-dnd';

function CustomDragLayer(props) {
    const getItemStyles = () => {
        const { currentOffset } = props;

        if (!currentOffset) {
            return {
                display: 'none'
            };
        }

        const { x, y } = currentOffset;
        const transform = `translate(${x}px, ${y}px)`;

        return {
            transform: transform,
            WebkitTransform: transform
        };
    };

    if (!props.isDragging) {
        return null;
    }

    const layerStyles = {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    };

    return (
        <div style={layerStyles}>
            <div style={getItemStyles()}>
                TODO
            </div>
        </div>
    );
}

function collect(monitor) {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    };
}

export default DragLayer(collect)(CustomDragLayer);