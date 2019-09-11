import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getVisibleNote } from 'selectors/NoteSelectors';

export function NoteTitle(props) {
    const note = useSelector(state => getVisibleNote(state, props.noteId));
    return note ? <Icon icon="circle" color={note.color} text={note.title} /> : <span>&nbsp;</span>;
}

NoteTitle.propTypes = {
    noteId: PropTypes.string
};

export default NoteTitle;