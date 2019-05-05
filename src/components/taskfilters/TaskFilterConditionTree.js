import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Empty, Menu } from 'antd';
import ConditionTree from 'components/common/conditiontree/ConditionTree';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import withTaskFields from 'containers/WithTaskFields';
import TaskFilterConditionForm from 'components/taskfilters/TaskFilterConditionForm';

function TaskFilterEmpty() {
    return (
        <Empty />
    );
}

function TaskFilterConditionTree(props) {
    const createLeafObject = (parentCondition, key) => {
        const field = props.taskFields.find(field => field.id === key);

        if (!field) {
            throw new Error('Unknown condition field "' + key + '"');
        }

        return {
            id: uuid(),
            field: field.id,
            type: null,
            value: null
        };
    };

    const getLeafComponent = condition => {
        const field = props.taskFields.find(field => field.id === condition.field);

        if (!field) {
            return TaskFilterEmpty;
        }

        return TaskFilterConditionForm;
    };

    const onSaveCondition = condition => {
        props.updateTaskFilter({
            ...props.taskFilter,
            condition: condition
        });
    };

    return (
        <ConditionTree
            disabled={!!props.disabled}
            condition={props.taskFilter.condition}
            context={props.context}
            addMenuItems={props.taskFields.map(field => (
                <Menu.Item key={field.id}>{field.title}</Menu.Item>
            ))}
            createLeafObject={createLeafObject}
            getLeafComponent={getLeafComponent}
            onSaveCondition={onSaveCondition} />
    );
}

TaskFilterConditionTree.propTypes = {
    taskFilter: PropTypes.object.isRequired,
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired),
    context: PropTypes.object,
    disabled: PropTypes.bool,
    updateTaskFilter: PropTypes.func.isRequired
};

export default withTaskFields(TaskFilterConditionTree);
