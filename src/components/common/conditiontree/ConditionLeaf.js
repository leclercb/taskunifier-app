import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import { DragSource } from 'react-dnd';
import ItemTypes from 'components/common/conditiontree/ItemTypes';
import { ConditionGroupPropType, ConditionLeafPropType } from 'components/common/conditiontree/ConditionPropTypes';

function ConditionLeaf(props) {
    const { condition, parentCondition } = props;

    return (
        <div className='condition-container'>
            {props.disabled ? null : props.connectDragSource(<div className='condition-leaf-drag'><Icon type="drag" /></div>)}
            {
                React.createElement(
                    props.getLeafComponent(props.condition),
                    {
                        condition: props.condition,
                        context: props.context,
                        disabled: props.disabled,
                        onUpdate: props.onUpdate
                    })
            }
            {props.disabled ? null : (
                <div className='condition-actions'>
                    <Button
                        shape="circle"
                        icon="minus"
                        size="small"
                        onClick={() => props.onDelete(condition, parentCondition)} />
                </div>
            )}
        </div>
    );
}

ConditionLeaf.propTypes = {
    condition: ConditionLeafPropType.isRequired,
    parentCondition: ConditionGroupPropType,
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    getLeafComponent: PropTypes.any.isRequired,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onEndDrag: PropTypes.func.isRequired,
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
            props.onEndDrag(item, dropResult);
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