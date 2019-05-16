import React from 'react';
import PropTypes from 'prop-types';
import { NotePropType } from 'proptypes/NotePropTypes';
import withNote from 'containers/WithNote';
import Icon from 'components/common/Icon';

export function NoteTitle(props) {
    const { note } = props;

    return note ? (
        <Icon
            icon="circle"
            color={note.color}
            text={note.title} />
    ) : <span>&nbsp;</span>;
}

NoteTitle.propTypes = {
    noteId: PropTypes.string,
    note: NotePropType
};

export default withNote(NoteTitle);