import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Select } from 'antd';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import AddButton from './AddButton';
import Condition from './Condition';
import { conditionGroup } from './ConditionPropTypes';
import Constants from '../../constants/Constants';

function ConditionGroup(props) {
    const isActive = props.canDrop && props.isOver;

    let colors = {
        AND: Constants.conditionTreeGroupAndColor,
        OR: Constants.conditionTreeGroupOrColor,
        NOT: Constants.conditionTreeGroupNotColor
    };

    if (isActive) {
        colors = {
            AND: Constants.conditionTreeGroupAndActiveColor,
            OR: Constants.conditionTreeGroupOrActiveColor,
            NOT: Constants.conditionTreeGroupNotActiveColor
        };
    }

    const condition = props.condition;
    const parentCondition = props.parentCondition;

    return <div className='condition-group-container'>
        {props.connectDragSource(props.connectDropTarget(
            <div className='condition-group-operator' style={{ background: colors[condition.operator] }}>
                <div className='condition-group-operator-text'>
                    <Select
                        defaultValue={condition.operator}
                        style={{ width: 80 }}
                        disabled={props.disabled}
                        onChange={(value) => {
                            condition.operator = value;
                            props.onUpdate(condition);
                        }}>
                        <Select.Option value="AND">AND</Select.Option>
                        <Select.Option value="OR">OR</Select.Option>
                        <Select.Option value="NOT">NOT</Select.Option>
                    </Select>
                </div>
                {props.disabled ? null :
                    <div className='condition-group-operator-actions'>
                        <AddButton onClick={(key) => props.onAdd(condition, key)}>
                            {props.addMenuItems}
                        </AddButton>
                        <br />
                        <Button
                            shape="circle"
                            icon="minus"
                            size="small"
                            onClick={() => props.onDelete(condition, parentCondition)} />
                    </div>
                }
            </div>
        ))}
        <div className='condition-group-content'>
            {condition.conditions.map(cond => {
                return <Condition
                    key={cond.id}
                    condition={cond}
                    parentCondition={condition}
                    context={props.context}
                    disabled={props.disabled}
                    onAdd={props.onAdd}
                    onDelete={props.onDelete}
                    onUpdate={props.onUpdate}
                    onEndDrag={props.onEndDrag}
                    addMenuItems={props.addMenuItems}
                    getLeafComponent={props.getLeafComponent} />;
            })}

            {(condition.operator === 'AND' || condition.operator === 'OR') && condition.conditions.length < 2 ? (
                <Alert
                    message="Warning"
                    description={'A condition group with operator \'' + condition.operator + '\' must contain at least two sub-conditions.'}
                    type="warning"
                    showIcon
                />
            ) : null}

            {condition.operator === 'NOT' && condition.conditions.length !== 1 ? (
                <Alert
                    message="Warning"
                    description={'A condition group with operator \'' + condition.operator + '\' must contain exactly one sub-condition.'}
                    type="warning"
                    showIcon
                />
            ) : null}
        </div>
    </div>;
}

ConditionGroup.propTypes = {
    condition: PropTypes.shape(conditionGroup).isRequired,
    parentCondition: PropTypes.shape(conditionGroup),
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onEndDrag: PropTypes.func.isRequired,
    addMenuItems: PropTypes.node.isRequired,
    getLeafComponent: PropTypes.any.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
};

const conditionSource = {
    canDrag(props) {
        return !props.disabled && props.parentCondition ? true : false;
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

const conditionTarget = {
    canDrop(props, monitor) {
        if (props.condition === monitor.getItem().condition) {
            return false;
        }

        var contains = function (sourceCondition, targetCondition) {
            if (targetCondition.operator) {
                for (var i = 0; i < targetCondition.conditions.length; i++) {
                    if (targetCondition.conditions[i] === sourceCondition) {
                        return true;
                    }

                    if (contains(sourceCondition, targetCondition.conditions[i])) {
                        return true;
                    }
                }
            }

            return false;
        };

        return !contains(props.condition, monitor.getItem().condition);
    },
    drop(props) {
        return {
            condition: props.condition
        };
    }
};

function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

export default DropTarget(ItemTypes.CONDITION, conditionTarget, collectTarget)(DragSource(ItemTypes.CONDITION, conditionSource, collectSource)(ConditionGroup));