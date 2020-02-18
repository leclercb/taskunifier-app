import React from 'react';
import { DragOutlined, MinusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { ConditionGroupPropType, ConditionLeafPropType } from 'components/common/conditiontree/ConditionPropTypes';

function ConditionLeaf(props) {
    const { condition, parentCondition } = props;

    // eslint-disable-next-line no-unused-vars
    const [collectedDragProps, drag] = useDrag({
        item: {
            type: 'condition',
            condition: props.condition,
            parentCondition: props.parentCondition
        },
        canDrag: () => !props.disabled && props.parentCondition
    });

    return (
        <div className='condition-container'>
            {!props.disabled && props.parentCondition && (
                <div ref={drag} className='condition-leaf-drag'>
                    <DragOutlined />
                </div>
            )}
            {React.createElement(
                props.getLeafComponent(props.condition),
                {
                    condition: props.condition,
                    context: props.context,
                    disabled: props.disabled,
                    onUpdate: props.onUpdate
                }
            )}
            {!props.disabled && (
                <div className='condition-actions'>
                    <Button
                        shape="circle"
                        icon={(<MinusOutlined />)}
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
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    getLeafComponent: PropTypes.any.isRequired
};

export default ConditionLeaf;