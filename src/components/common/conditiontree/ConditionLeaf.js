import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';
import { conditionGroup, conditionLeaf } from './ConditionPropTypes';

function ConditionLeaf(props) {
    const condition = props.condition;
    const parentCondition = props.parentCondition;

    return (
        <div className='condition-container'>
            {props.disabled ? null : props.connectDragSource(<div className='condition-leaf-drag'><Icon type="drag" /></div>)}
            {
                React.createElement(
                    props.getLeafComponent(props.condition),
                    {
                        condition: props.condition,
                        context: props.context,
                        disabled: props.disabled
                    })
            }
            {props.disabled ? null :
                <div className='condition-actions'>
                    <Button
                        shape="circle"
                        icon="minus"
                        size="small"
                        onClick={() => props.handleDelete(condition, parentCondition)} />
                </div>
            }
        </div>
    );
}

ConditionLeaf.propTypes = {
    condition: PropTypes.shape(conditionLeaf).isRequired,
    parentCondition: PropTypes.shape(conditionGroup),
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    getLeafComponent: PropTypes.any.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handleEndDrag: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
};

const conditionSource = {
    canDrag(props) {
        return !props.disabled;
    },
    beginDrag(props) {
        return {
            condition: props.condition,
            parentCondition: props.parentCondition
        };
    },
    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if (dropResult) {
            props.handleEndDrag(item, dropResult);
        }
    }
};

function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

export default DragSource(ItemTypes.CONDITION, conditionSource, collectSource)(ConditionLeaf);