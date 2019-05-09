import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { NotePropType } from 'proptypes/NotePropTypes';
import withNotes from 'containers/WithNotes';
import Icon from 'components/common/Icon';

export function NoteSelect(props) {
    const { notes, ...restProps } = props;

    restProps.value = props.notes.find(note => note.id === restProps.value) ? restProps.value : null;

    return (
        <Select allowClear={true} {...restProps}>
            {notes.map(note => (
                <Select.Option key={note.id} value={note.id}>
                    <Icon icon="circle" color={note.color} text={note.title} />
                </Select.Option>
            ))}
        </Select>
    );
}

NoteSelect.propTypes = {
    notes: PropTypes.arrayOf(NotePropType.isRequired).isRequired
};

export default withNotes(NoteSelect);