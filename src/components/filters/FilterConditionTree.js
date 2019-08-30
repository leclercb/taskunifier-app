import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { Empty, Menu } from 'antd';
import ConditionTree from 'components/common/conditiontree/ConditionTree';
import FilterConditionForm from 'components/filters/FilterConditionForm';
import { FieldPropType } from 'proptypes/FieldPropTypes';

function FilterEmpty() {
    return (
        <Empty />
    );
}

function FilterConditionTree(props) {
    const createLeafObject = (parentCondition, key) => {
        const field = props.context.fields.find(field => field.id === key);

        if (!field) {
            throw new Error('Unknown condition field "' + key + '"');
        }

        return {
            id: uuid(),
            field: field.id,
            type: null,
            value: undefined
        };
    };

    const getLeafComponent = condition => {
        const field = props.context.fields.find(field => field.id === condition.field);

        if (!field) {
            return FilterEmpty;
        }

        return FilterConditionForm;
    };

    const onSaveCondition = condition => {
        props.updateFilter({
            ...props.filter,
            condition
        });
    };

    return (
        <ConditionTree
            disabled={!!props.disabled}
            condition={props.filter.condition}
            context={props.context}
            addMenuItems={props.context.fields.map(field => (
                <Menu.Item key={field.id}>{field.title}</Menu.Item>
            ))}
            createLeafObject={createLeafObject}
            getLeafComponent={getLeafComponent}
            onSaveCondition={onSaveCondition} />
    );
}

FilterConditionTree.propTypes = {
    filter: PropTypes.object.isRequired,
    context: PropTypes.shape({
        fields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired
    }).isRequired,
    disabled: PropTypes.bool,
    updateFilter: PropTypes.func.isRequired
};

export default FilterConditionTree;
