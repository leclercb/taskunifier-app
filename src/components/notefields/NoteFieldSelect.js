import React from 'react';
import { Select, Tag } from 'antd';
import PropTypes from 'prop-types';
import withNoteFields from 'containers/WithNoteFields';
import { FieldPropType } from 'proptypes/FieldPropTypes';

export function NoteFieldSelect(props) {
    const { noteFields, ...restProps } = props;

    restProps.value = noteFields.find(noteField => noteField.id === restProps.value) ? restProps.value : null;

    return (
        <Select allowClear={true} {...restProps}>
            {noteFields.map(field => (
                <Select.Option key={field.id} value={field.id}>
                    <Tag color={field.color}>{field.title}</Tag>
                </Select.Option>
            ))}
        </Select>
    );
}

NoteFieldSelect.propTypes = {
    noteFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired
};

export default withNoteFields(NoteFieldSelect);