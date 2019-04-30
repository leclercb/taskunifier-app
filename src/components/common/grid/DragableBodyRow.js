import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import 'components/common/grid/DragableBodyRow.css';

const BodyRow = props => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        ...restProps
    } = props;

    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;

    if (isOver) {
        className += ' drop-over';
    }

    delete restProps.moveRow;
    delete restProps.rowProps;

    return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
};

BodyRow.propTypes = {
    rowProps: PropTypes.object,
    isOver: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    moveRow: PropTypes.func.isRequired,
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