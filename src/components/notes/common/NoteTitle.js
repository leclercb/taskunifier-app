import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useNote } from 'hooks/UseNote';

export function NoteTitle(props) {
    const note = useNote(props.noteId);
    return note ? <Icon icon="circle" color={note.color} text={note.title} /> : <span>&nbsp;</span>;
}

NoteTitle.propTypes = {
    noteId: PropTypes.string
};

export default NoteTitle;