import React from 'react';
import PropTypes from 'prop-types';
import { Empty, Menu } from 'antd';
import ConditionTree from '../common/conditiontree/ConditionTree';

function FilterConditionTree(props) {
    const createLeafObject = (parentCondition, key) => {
        switch (key) {
            case 'title':
                return {
                    'field': 'title',
                    'condition': 'equals',
                    'value': ''
                };
            default:
                throw new Error('Unknown condition type "' + key + '"');
        }
    }

    const getLeafComponent = condition => {
        switch (condition.field) {
            case 'title':
                return <Empty />;
            default:
                throw new Error('Unknown condition type "' + condition.field + '"');
        }
    }

    return (
        <ConditionTree
            disabled={!!props.disabled}
            condition={props.filter.condition}
            context={props.context}
            createLeafObject={createLeafObject}
            addMenuItems={[
                <Menu.Item key="title">Title</Menu.Item>
            ]}
            getLeafComponent={getLeafComponent} />
    );
}

FilterConditionTree.propTypes = {
    filter: PropTypes.object.isRequired,
    context: PropTypes.object,
    disabled: PropTypes.bool,
    updateFilter: PropTypes.func.isRequired
};

export default FilterConditionTree;
