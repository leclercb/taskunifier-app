import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useNoteField } from 'hooks/UseNoteField';

export function NoteFieldTitle(props) {
    const noteField = useNoteField(props.noteFieldId);
    return noteField ? <Icon icon="circle" color={noteField.color} text={noteField.title} /> : <span>&nbsp;</span>;
}

NoteFieldTitle.propTypes = {
    noteFieldId: PropTypes.string
};

export default NoteFieldTitle;