import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Menu, Empty } from 'antd';
import ConditionTree from '../common/conditiontree/ConditionTree';
import { FieldPropType } from '../../proptypes/FieldPropTypes';
import withNoteFields from 'containers/WithNoteFields';
import NoteFilterConditionForm from 'components/notefilters/NoteFilterConditionForm';

function NoteFilterEmpty(props) {
    return (<Empty />);
}

function NoteFilterConditionTree(props) {
    const createLeafObject = (parentCondition, key) => {
        const field = props.noteFields.find(field => field.id === key);

        if (!field) {
            throw new Error('Unknown condition field "' + key + '"');
        }

        return {
            id: uuid(),
            field: field.id,
            type: 'equal',
            value: null
        };
    };

    const getLeafComponent = condition => {
        const field = props.noteFields.find(field => field.id === condition.field);

        if (!field) {
            return NoteFilterEmpty;
        }

        return NoteFilterConditionForm;
    };

    const onSaveCondition = condition => {
        props.updateNoteFilter({
            ...props.noteFilter,
            condition: condition
        });
    };

    return (
        <ConditionTree
            disabled={!!props.disabled}
            condition={props.noteFilter.condition}
            context={props.context}
            addMenuItems={props.noteFields.map(field => (
                <Menu.Item key={field.id}>{field.title}</Menu.Item>
            ))}
            createLeafObject={createLeafObject}
            getLeafComponent={getLeafComponent}
            onSaveCondition={onSaveCondition} />
    );
}

NoteFilterConditionTree.propTypes = {
    noteFilter: PropTypes.object.isRequired,
    noteFields: PropTypes.arrayOf(FieldPropType),
    context: PropTypes.object,
    disabled: PropTypes.bool,
    updateNoteFilter: PropTypes.func.isRequired
};

export default withNoteFields(NoteFilterConditionTree);
