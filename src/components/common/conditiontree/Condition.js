import React from 'react';
import PropTypes from 'prop-types';
import ConditionLeaf from 'components/common/conditiontree/ConditionLeaf';
import ConditionGroup from 'components/common/conditiontree/ConditionGroup';
import { ConditionGroupPropType, ConditionPropType } from 'components/common/conditiontree/ConditionPropTypes';

function Condition(props) {
    if (props.condition.operator) {
        return (
            <ConditionGroup
                condition={props.condition}
                parentCondition={props.parentCondition}
                context={props.context}
                disabled={props.disabled}
                onAdd={props.onAdd}
                onDelete={props.onDelete}
                onUpdate={props.onUpdate}
                onEndDrag={props.onEndDrag}
                addMenuItems={props.addMenuItems}
                getLeafComponent={props.getLeafComponent} />
        );
    } else {
        return (
            <ConditionLeaf
                condition={props.condition}
                parentCondition={props.parentCondition}
                context={props.context}
                disabled={props.disabled}
                onDelete={props.onDelete}
                onUpdate={props.onUpdate}
                getLeafComponent={props.getLeafComponent} />
        );
    }
}

Condition.propTypes = {
    condition: ConditionPropType.isRequired,
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

export default Condition;