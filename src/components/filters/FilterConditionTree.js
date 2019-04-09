import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Empty, Menu } from 'antd';
import ConditionTree from '../common/conditiontree/ConditionTree';

function FilterConditionTree(props) {
    const createLeafObject = (parentCondition, key) => {
        switch (key) {
            case 'title':
                return {
                    'id': uuid(),
                    'type': 'title',
                    'condition': 'equals',
                    'value': ''
                };
            case 'completed':
                return {
                    'id': uuid(),
                    'type': 'completed',
                    'condition': 'equals',
                    'value': ''
                };
            default:
                throw new Error('Unknown condition type "' + key + '"');
        }
    }

    const getLeafComponent = condition => {
        switch (condition.type) {
            case 'title':
                return Empty;
            case 'completed':
                return Empty;
            default:
                throw new Error('Unknown condition type "' + condition.type + '"');
        }
    }

    const onUpdateCondition = condition => {
        // TODO don't save directly
        props.updateFilter({
            ...props.filter,
            condition: condition
        });
    }

    return (
        <ConditionTree
            disabled={!!props.disabled}
            condition={props.filter.condition}
            context={props.context}
            addMenuItems={[
                <Menu.Item key="title">Title</Menu.Item>,
                <Menu.Item key="completed">Completed</Menu.Item>
            ]}
            createLeafObject={createLeafObject}
            getLeafComponent={getLeafComponent}
            onUpdateCondition={onUpdateCondition} />
    );
}

FilterConditionTree.propTypes = {
    filter: PropTypes.object.isRequired,
    context: PropTypes.object,
    disabled: PropTypes.bool,
    updateFilter: PropTypes.func.isRequired
};

export default FilterConditionTree;
