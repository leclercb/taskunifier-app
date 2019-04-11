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
                handleAddSaveCallback={props.handleAddSaveCallback}
                handleAdd={props.handleAdd}
                handleDelete={props.handleDelete}
                handleUpdate={props.handleUpdate}
                handleEndDrag={props.handleEndDrag}
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
                handleAddSaveCallback={props.handleAddSaveCallback}
                handleDelete={props.handleDelete}
                handleUpdate={props.handleUpdate}
                handleEndDrag={props.handleEndDrag}
                getLeafComponent={props.getLeafComponent} />
        );
    }
}

Condition.propTypes = {
    condition: condition.isRequired,
    parentCondition: PropTypes.shape(conditionGroup),
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    handleAddSaveCallback: PropTypes.func.isRequired,
    handleAdd: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handleEndDrag: PropTypes.func.isRequired,
    addMenuItems: PropTypes.node.isRequired,
    getLeafComponent: PropTypes.any.isRequired
};

export default Condition;