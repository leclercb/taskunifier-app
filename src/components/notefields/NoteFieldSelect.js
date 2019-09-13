import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';

export const NoteFieldSelect = React.forwardRef(function NoteFieldSelect(props, ref) {
    const noteFieldApi = useNoteFieldApi();
    const value = noteFieldApi.noteFields.find(noteField => noteField.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {noteFieldApi.noteFields.map(noteField => (
                <Select.Option key={noteField.id} value={noteField.id}>
                    <Icon icon="circle" color={noteField.color} text={noteField.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

NoteFieldSelect.displayName = 'ForwardRefNoteFieldSelect';

NoteFieldSelect.propTypes = {
    value: PropTypes.string
};

export default NoteFieldSelect;