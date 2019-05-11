import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import withNoteFields from 'containers/WithNoteFields';
import { FieldPropType } from 'proptypes/FieldPropTypes';

export const NoteFieldSelect = React.forwardRef(function NoteFieldSelect(props, ref) {
    const { noteFields, ...restProps } = props;

    restProps.value = noteFields.find(noteField => noteField.id === restProps.value) ? restProps.value : null;

    return (
        <Select ref={ref} allowClear={true} {...restProps}>
            {noteFields.map(field => (
                <Select.Option key={field.id} value={field.id}>
                    <Icon icon="circle" color={field.color} text={field.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

NoteFieldSelect.propTypes = {
    noteFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired
};

export default withNoteFields(NoteFieldSelect);