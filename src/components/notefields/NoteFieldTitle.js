import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getVisibleNoteField } from 'selectors/NoteFieldSelectors';

export function NoteFieldTitle(props) {
    const noteField = useSelector(state => getVisibleNoteField(state, props.noteFieldId));
    return noteField ? <Icon icon="circle" color={noteField.color} text={noteField.title} /> : <span>&nbsp;</span>;
}

NoteFieldTitle.propTypes = {
    noteFieldId: PropTypes.string
};

export default NoteFieldTitle;