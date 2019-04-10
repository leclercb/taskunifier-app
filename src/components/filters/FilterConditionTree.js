import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Empty, Menu } from 'antd';
import ConditionTree from '../common/conditiontree/ConditionTree';
import { FieldPropType } from '../../proptypes/FieldPropTypes';
import withFields from '../../containers/WithFields';

function FilterConditionTree(props) {
    const createLeafObject = (parentCondition, key) => {
        const field = props.fields.find(field => field.id === key);

        if (!field) {
            throw new Error('Unknown condition field "' + key + '"');
        }

        return {
            id: uuid(),
            field: field.id,
            condition: 'equals',
            value: null
        };
    }

    const getLeafComponent = condition => {
        const field = props.fields.find(field => field.id === condition.field);

        if (!field) {
            throw new Error('Unknown condition field "' + condition.field + '"');
        }

        switch (field.type) {
            case 'text':
                return Empty;
            case 'checkbox':
                return Empty;
            default:
                throw new Error('Unknown field type "' + condition.field + '"');
        }
    }

    const onSaveCondition = condition => {
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
            addMenuItems={props.fields.map(field => (
                <Menu.Item key={field.id}>{field.title}</Menu.Item>
            ))}
            createLeafObject={createLeafObject}
            getLeafComponent={getLeafComponent}
            onSaveCondition={onSaveCondition} />
    );
}

FilterConditionTree.propTypes = {
    filter: PropTypes.object.isRequired,
    fields: PropTypes.arrayOf(FieldPropType),
    context: PropTypes.object,
    disabled: PropTypes.bool,
    updateFilter: PropTypes.func.isRequired
};

export default withFields(FilterConditionTree);
