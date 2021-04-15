import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Empty } from 'antd';
import AddButton from 'components/common/conditiontree/AddButton';
import Condition from 'components/common/conditiontree/Condition';
import { ConditionPropType } from 'components/common/conditiontree/ConditionPropTypes';
import { clone } from 'utils/ObjectUtils';
import 'components/common/conditiontree/ConditionTree.css';

function ConditionTree(props) {
    const rootCondition = clone(props.condition);

    const onAdd = (condition, key) => {
        let newCondition = null;

        if (key === 'conditionGroupAnd') {
            newCondition = {
                id: uuid(),
                operator: 'AND',
                conditions: []
            };
        } else if (key === 'conditionGroupOr') {
            newCondition = {
                id: uuid(),
                operator: 'OR',
                conditions: []
            };
        } else if (key === 'conditionGroupNot') {
            newCondition = {
                id: uuid(),
                operator: 'NOT',
                conditions: []
            };
        } else {
            newCondition = props.createLeafObject(condition, key);
        }

        if (!newCondition) {
            return;
        }

        if (!condition) {
            props.onSaveCondition(newCondition);
        } else {
            condition.conditions.push(newCondition);
            props.onSaveCondition(rootCondition);
        }
    };

    const onUpdate = () => {
        props.onSaveCondition(rootCondition);
    };

    const onDelete = (condition, parentCondition) => {
        if (!parentCondition) {
            props.onSaveCondition(null);
        } else {
            parentCondition.conditions.splice(parentCondition.conditions.indexOf(condition), 1);
            props.onSaveCondition(rootCondition);
        }
    };

    const onEndDrag = (item, dropCondition) => {
        if (!item.parentCondition) {
            return;
        }

        item.parentCondition.conditions.splice(item.parentCondition.conditions.indexOf(item.condition), 1);
        dropCondition.conditions.push(item.condition);

        props.onSaveCondition(rootCondition);
    };

    if (!rootCondition) {
        if (props.disabled) {
            return null;
        }

        return (
            <React.Fragment>
                <AddButton
                    onClick={(key) => onAdd(null, key)}
                    menuItems={props.addMenuItems} />
                <Empty description='No filter, click on the "+" icon to add your first condition !' />
            </React.Fragment>
        );
    }

    return (
        <Condition
            disabled={props.disabled}
            condition={rootCondition}
            parentCondition={null}
            context={props.context}
            onAdd={onAdd}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onEndDrag={onEndDrag}
            addMenuItems={props.addMenuItems}
            getLeafComponent={props.getLeafComponent} />
    );
}

ConditionTree.propTypes = {
    condition: ConditionPropType,
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    addMenuItems: PropTypes.oneOfType([PropTypes.node.isRequired, PropTypes.func.isRequired]).isRequired,
    createLeafObject: PropTypes.func.isRequired,
    getLeafComponent: PropTypes.any.isRequired,
    onSaveCondition: PropTypes.func.isRequired
};

export default ConditionTree;