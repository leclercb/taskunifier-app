import React from 'react';
import PropTypes from 'prop-types';
import ConditionLeaf from './ConditionLeaf';
import ConditionGroup from './ConditionGroup';
import { condition, conditionGroup } from './ConditionPropTypes';

function Condition(props) {
    if (props.condition.operator) {
        return (
            <ConditionGroup
                condition={props.condition}
                parentCondition={props.parentCondition}
                context={props.context}
                disabled={props.disabled}
                onChangeSaveRef={props.onChangeSaveRef}
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
                onChangeSaveRef={props.onChangeSaveRef}
                onDelete={props.onDelete}
                onUpdate={props.onUpdate}
                onEndDrag={props.onEndDrag}
                getLeafComponent={props.getLeafComponent} />
        );
    }
}

Condition.propTypes = {
    condition: condition.isRequired,
    parentCondition: PropTypes.shape(conditionGroup),
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    onChangeSaveRef: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onEndDrag: PropTypes.func.isRequired,
    addMenuItems: PropTypes.node.isRequired,
    getLeafComponent: PropTypes.any.isRequired
};

export default Condition;