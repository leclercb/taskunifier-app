import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import withNoteField from 'containers/WithNoteField';
import { FieldPropType } from 'proptypes/FieldPropTypes';

export function NoteFieldTitle(props) {
    const { noteField } = props;
    return noteField ? <Icon icon="circle" color={noteField.color} text={noteField.title} /> : <span>&nbsp;</span>;
}

NoteFieldTitle.propTypes = {
    noteFieldId: PropTypes.string,
    noteField: FieldPropType
};

export default withNoteField(NoteFieldTitle);