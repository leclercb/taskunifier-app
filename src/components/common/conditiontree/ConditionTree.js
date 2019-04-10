import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Button } from 'antd';
import AddButton from './AddButton';
import Condition from './Condition';
import { condition } from './ConditionPropTypes';
import './ConditionTree.css';
import { usePrevious } from '../../../hooks/UsePrevious';
import { clone } from '../../../utils/ObjectUtils';

function ConditionTree(props) {
    const [ rootCondition, setRootCondition ] = useState(clone(props.condition));
    const prevCondition = usePrevious(props.condition);

    if (prevCondition !== props.condition) {
        setRootCondition(clone(props.condition));
    }

    const handleAdd = (condition, key) => {
        let newCondition = null;

        if (key === 'condition_group_and') {
            newCondition = {
                id: uuid(),
                operator: 'AND',
                conditions: []
            };
        } else if (key === 'condition_group_or') {
            newCondition = {
                id: uuid(),
                operator: 'OR',
                conditions: []
            };
        } else if (key === 'condition_group_not') {
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
            props.onUpdateCondition(condition);
        } else {
            condition.conditions.push(newCondition);
            props.onUpdateCondition(rootCondition);
        }
    };

    const handleUpdate = (condition) => {
        props.onUpdateCondition(rootCondition);
    };

    const handleDelete = (condition, parentCondition) => {
        if (!parentCondition) {
            props.onUpdateCondition(null);
        } else {
            parentCondition.conditions.splice(parentCondition.conditions.indexOf(condition), 1);
            props.onUpdateCondition(rootCondition);
        }
    };

    const handleEndDrag = (item, dropResult) => {
        if (!item.parentCondition) {
            return;
        }

        item.parentCondition.conditions.splice(item.parentCondition.conditions.indexOf(item.condition), 1);
        dropResult.condition.conditions.push(item.condition);

        props.onUpdateCondition(rootCondition);
    };

    if (!rootCondition) {
        if (props.disabled) {
            return null;
        } else {
            return <div>
                <AddButton onClick={(key) => handleAdd(null, key)}>
                    {props.addMenuItems}
                </AddButton>
                <Button
                    shape="circle"
                    icon="minus"
                    size="small"
                    disabled={props.disabled}
                    onClick={() => handleDelete(null)}
                    style={{ marginLeft: '3px' }} />
            </div>;
        }
    }

    return <Condition
        disabled={props.disabled}
        condition={rootCondition}
        parentCondition={null}
        context={props.context}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        handleEndDrag={handleEndDrag}
        addMenuItems={props.addMenuItems}
        getLeafComponent={props.getLeafComponent} />;
}

ConditionTree.propTypes = {
    condition: condition,
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    addMenuItems: PropTypes.node.isRequired,
    createLeafObject: PropTypes.func.isRequired,
    getLeafComponent: PropTypes.any.isRequired,
    onUpdateCondition: PropTypes.func.isRequired
};

export default ConditionTree;