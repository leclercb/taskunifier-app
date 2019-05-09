import React from 'react';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import Draggable from 'react-draggable';
import { SortIndicator } from 'react-virtualized';
import { move } from 'utils/ArrayUtils';
import 'components/common/grid/VirtualizedTable.css';

let TIMEOUT = null;

export const resizeHandler = (prefix, updateSettings) => (fieldId, width) => {
    updateSettings({
        [prefix + fieldId]: width
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

function DndWrapper(props) {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        ...restProps
    } = props;

    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;

    if (isOver) {
        className += ' DropOver';
    }

    delete restProps.data;
    delete restProps.onDrop;

    return connectDragSource(connectDropTarget(<div {...restProps} className={className} style={style} />));
}

DndWrapper.propTypes = {
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
    'row',
    target,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    })
);

const dragSource = DragSource(
    'row',
    source,
    (connect) => ({
        connectDragSource: connect.dragSource()
    })
);

const DraggableElement = dropTarget(dragSource(DndWrapper));

export const resizableAndMovableColumn = ({
    dataKey,
    label,
    sortBy,
    sortDirection
}, onResize, onMove) => {
    const showSortIndicator = sortBy === dataKey;

    return (
        <React.Fragment key={dataKey}>
            <DraggableElement
                data={{ dataKey, label }}
                onDrop={(dragData, dropData) => onMove(dragData, dropData)}
                className="ReactVirtualized__Table__headerTruncatedText">
                {label}
            </DraggableElement>
            {showSortIndicator ? (
                <SortIndicator key="SortIndicator" sortDirection={sortDirection} />
            ) : null}
            <Draggable
                axis="x"
                defaultClassName="DragHandle"
                defaultClassNameDragging="DragHandleActive"
                onDrag={(event, data) => onResize(data)}
                position={{ x: 0 }}
                zIndex={999}>
                <span className="DragHandleIcon">⋮</span>
            </Draggable>
        </React.Fragment>
    );
};

export const multiSelectionHandler = (getId, selectedIds, setSelectedIds) => ({ event, rowData }) => {
    const rowId = getId(rowData);
    const ctrlKey = event.ctrlKey;
    let dataPreventDefault = false;

    if (event.target.attributes.getNamedItem('data-prevent-default') &&
        event.target.attributes.getNamedItem('data-prevent-default').value === 'true') {
        dataPreventDefault = true;
    } else if (event.target.nodeName === 'path') {
        dataPreventDefault = true;
    }

    if (document &&
        document.activeElement &&
        document.activeElement !== document.body &&
        document.activeElement.className !== 'ReactVirtualized__Table__row') {
        return;
    }

    if (dataPreventDefault) {
        return;
    }

    const fn = ctrlKey => {
        TIMEOUT = null;

        selectedIds = [...selectedIds];

        if (selectedIds.includes(rowId)) {
            if (ctrlKey) {
                selectedIds.splice(selectedIds.indexOf(rowId), 1);
            } else {
                selectedIds = selectedIds.length > 1 ? [rowId] : [];
            }
        } else {
            if (ctrlKey) {
                selectedIds.push(rowId);
            } else {
                selectedIds = [rowId];
            }
        }

        setSelectedIds(selectedIds);
    };

    if (TIMEOUT) {
        clearTimeout(TIMEOUT);
        TIMEOUT = null;
    } else {
        TIMEOUT = setTimeout(() => fn(ctrlKey), 200);
        return;
    }
};