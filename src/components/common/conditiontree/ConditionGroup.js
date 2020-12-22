import React, { useRef } from 'react';
import { MinusOutlined } from '@ant-design/icons';
import { Alert, Button, Empty, Select } from 'antd';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import AddButton from 'components/common/conditiontree/AddButton';
import Condition from 'components/common/conditiontree/Condition';
import { ConditionGroupPropType } from 'components/common/conditiontree/ConditionPropTypes';
import Constants from 'constants/Constants';

function ConditionGroup(props) {
    const ref = useRef(null);

    // eslint-disable-next-line no-unused-vars
    const [collectedDragProps, drag] = useDrag({
        item: {
            type: 'condition',
            condition: props.condition,
            parentCondition: props.parentCondition
        },
        canDrag: () => !props.disabled && props.parentCondition
    });

    const [collectedDropProps, drop] = useDrop({
        accept: 'condition',
        canDrop: item => {
            const dropCondition = props.condition;

            if (item.condition.id === dropCondition.id) {
                return false;
            }

            const contains = (sourceCondition, targetCondition) => {
                if (targetCondition.operator) {
                    for (let i = 0; i < targetCondition.conditions.length; i++) {
                        if (targetCondition.conditions[i].id === sourceCondition.id) {
                            return true;
                        }

                        if (contains(sourceCondition, targetCondition.conditions[i])) {
                            return true;
                        }
                    }
                }

                return false;
            };

            return !contains(dropCondition, item.condition);
        },
        drop: item => props.onEndDrag(item, props.condition),
        collect: monitor => ({
            canDrop: monitor.canDrop(),
            hovered: monitor.isOver()
        })
    });

    drag(ref);
    drop(ref);

    let operatorClassName = collectedDropProps.canDrop ? 'highlighted' : '';

    let colors = {
        AND: Constants.conditionTreeGroupAndColor,
        OR: Constants.conditionTreeGroupOrColor,
        NOT: Constants.conditionTreeGroupNotColor
    };

    if (collectedDropProps.hovered && collectedDropProps.canDrop) {
        operatorClassName = 'hovered';

        colors = {
            AND: Constants.conditionTreeGroupAndActiveColor,
            OR: Constants.conditionTreeGroupOrActiveColor,
            NOT: Constants.conditionTreeGroupNotActiveColor
        };
    }

    const { condition, parentCondition } = props;

    return (
        <div className="condition-group-container">
            <div
                ref={ref}
                className={'condition-group-operator ' + operatorClassName}
                style={{ background: colors[condition.operator] }}>
                <div className="condition-group-operator-text">
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
                {!props.disabled && (
                    <div className="condition-group-operator-actions">
                        <AddButton
                            disabled={condition.operator === 'NOT' && condition.conditions.length >= 1}
                            onClick={(key) => props.onAdd(condition, key)}
                            menuItems={props.addMenuItems} />
                        <br />
                        <Button
                            shape="circle"
                            icon={(<MinusOutlined />)}
                            size="small"
                            onClick={() => props.onDelete(condition, parentCondition)} />
                    </div>
                )}
            </div>
            <div className="condition-group-content">
                {condition.conditions.length === 0 ? (
                    <div className="condition-container">
                        <Alert
                            message="Info"
                            description={(<Empty description='No condition in this condition group, click on the "+" icon to add one !' />)}
                            type="info"
                            showIcon
                        />
                    </div>
                ) : null}

                {condition.operator === 'NOT' && condition.conditions.length > 1 ? (
                    <div className="condition-container">
                        <Alert
                            message="Warning"
                            description={`A condition group with operator '${condition.operator}' must contain exactly one sub-condition.`}
                            type="warning"
                            showIcon
                        />
                    </div>
                ) : null}

                {condition.conditions.map(cond => {
                    return (
                        <Condition
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
                            getLeafComponent={props.getLeafComponent} />
                    );
                })}
            </div>
        </div>
    );
}

ConditionGroup.propTypes = {
    condition: ConditionGroupPropType.isRequired,
    parentCondition: ConditionGroupPropType,
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onEndDrag: PropTypes.func.isRequired,
    addMenuItems: PropTypes.oneOfType([PropTypes.node.isRequired, PropTypes.func.isRequired]).isRequired,
    getLeafComponent: PropTypes.any.isRequired
};

export default ConditionGroup;