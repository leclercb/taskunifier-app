import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import AddButton from './AddButton';
import Condition from './Condition';
import { condition } from './ConditionPropTypes';
import './ConditionTree.css';

function ConditionTree(props) {
    const handleAdd = (condition, key) => {
        let newCondition = null;

        if (key === 'condition_group_and') {
            newCondition = {
                operator: 'AND',
                conditions: []
            };
        } else if (key === 'condition_group_or') {
            newCondition = {
                operator: 'OR',
                conditions: []
            };
        } else if (key === 'condition_group_not') {
            newCondition = {
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
            this.setState({
                condition: newCondition
            });
        } else {
            condition.conditions.push(newCondition);

            this.setState({
                condition: this.state.condition
            });
        }
    };

    const handleUpdate = (condition) => {

    };

    const handleDelete = (condition, parentCondition) => {
        if (!parentCondition) {
            /*             this.setState({
                            condition: null
                        }); */
        } else {
            /* parentCondition.conditions.splice(parentCondition.conditions.indexOf(condition), 1);

            this.setState({
                condition: this.state.condition
            }); */
        }
    };

    const handleEndDrag = (item, dropResult) => {
        /* if (!item.parentCondition) {
            return;
        }

        item.parentCondition.conditions.splice(item.parentCondition.conditions.indexOf(item.condition), 1);
        dropResult.condition.conditions.push(item.condition);

        this.setState({
            condition: this.state.condition
        }); */
    };

    if (!props.condition) {
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
        condition={props.condition}
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
    createLeafObject: PropTypes.func.isRequired,
    addMenuItems: PropTypes.node.isRequired,
    getLeafComponent: PropTypes.any.isRequired
};

export default ConditionTree;