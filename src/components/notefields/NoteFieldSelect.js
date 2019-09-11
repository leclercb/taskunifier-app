import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getNoteFieldsFilteredByVisibleState } from 'selectors/NoteFieldSelectors';

export const NoteFieldSelect = React.forwardRef(function NoteFieldSelect(props, ref) {
    const noteFields = useSelector(getNoteFieldsFilteredByVisibleState);
    const value = noteFields.find(noteField => noteField.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {noteFields.map(noteField => (
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