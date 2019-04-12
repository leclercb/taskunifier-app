import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Button, message } from 'antd';
import AddButton from './AddButton';
import Condition from './Condition';
import { condition } from './ConditionPropTypes';
import { usePrevious } from '../../../hooks/UsePrevious';
import { clone } from '../../../utils/ObjectUtils';
import Icon from '../Icon';
import './ConditionTree.css';

function ConditionTree(props) {
    const saveCallbacks = useRef([]);

    const [rootCondition, setRootCondition] = useState(clone(props.condition));
    const prevCondition = usePrevious(props.condition);

    const setClonedRootCondition = condition => setRootCondition(clone(condition));

    if (prevCondition !== props.condition) {
        setClonedRootCondition(props.condition);
    }

    const onSave = () => {
        const promises = [];

        Object.keys(saveCallbacks.current).forEach(key => {
            if (saveCallbacks.current[key]) {
                promises.push(saveCallbacks.current[key]());
            }
        });

        const promiseAll = Promise.all(promises);

        promiseAll.catch(() => {
            message.error('Please fix the validation errors');
        })

        promiseAll.then(() => {
            props.onSaveCondition(rootCondition);
        });
    };

    const handleAddSaveCallback = (id, callback) => {
        saveCallbacks.current = {
            ...saveCallbacks.current,
            [id]: callback
        }
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
            setClonedRootCondition(newCondition);
        } else {
            condition.conditions.push(newCondition);
            setClonedRootCondition(rootCondition);
        }
    };

    const handleUpdate = (condition) => {
        setClonedRootCondition(rootCondition);
    };

    const handleDelete = (condition, parentCondition) => {
        if (!parentCondition) {
            setClonedRootCondition(null);
        } else {
            parentCondition.conditions.splice(parentCondition.conditions.indexOf(condition), 1);
            setClonedRootCondition(rootCondition);
        }
    };

    const handleEndDrag = (item, dropResult) => {
        if (!item.parentCondition) {
            return;
        }

        item.parentCondition.conditions.splice(item.parentCondition.conditions.indexOf(item.condition), 1);
        dropResult.condition.conditions.push(item.condition);

        setClonedRootCondition(rootCondition);
    };

    const saveButton = (
        <Button type="primary" onClick={onSave} style={{ marginTop: 10 }}>
            <Icon icon="save" color="#ffffff" text="Save" />
        </Button>
    );

    if (!rootCondition) {
        if (props.disabled) {
            return null;
        } else {
            return <React.Fragment>
                <div>
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
                </div>
                {props.disabled ? null : saveButton}
            </React.Fragment>;
        }
    }

    return (
        <React.Fragment>
            <Condition
                disabled={props.disabled}
                condition={rootCondition}
                parentCondition={null}
                context={props.context}
                handleAddSaveCallback={handleAddSaveCallback}
                handleAdd={handleAdd}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                handleEndDrag={handleEndDrag}
                addMenuItems={props.addMenuItems}
                getLeafComponent={props.getLeafComponent} />
            {props.disabled ? null : saveButton}
        </React.Fragment>
    );
}

ConditionTree.propTypes = {
    condition: condition,
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    addMenuItems: PropTypes.node.isRequired,
    createLeafObject: PropTypes.func.isRequired,
    getLeafComponent: PropTypes.any.isRequired,
    onSaveCondition: PropTypes.func.isRequired
};

export default ConditionTree;