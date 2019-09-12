import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useNotes } from 'hooks/UseNotes';

export const NoteSelect = React.forwardRef(function NoteSelect(props, ref) {
    const noteApi = useNotes();
    const value = noteApi.notes.find(note => note.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {noteApi.notes.map(note => (
                <Select.Option key={note.id} value={note.id}>
                    <Icon icon="circle" color={note.color} text={note.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

NoteSelect.displayName = 'ForwardRefNoteSelect';

NoteSelect.propTypes = {
    value: PropTypes.string
};

export default NoteSelect;