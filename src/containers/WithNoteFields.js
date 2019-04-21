import React from 'react';
import { connect } from 'react-redux';
import { addNoteField, updateNoteField, deleteNoteField } from '../actions/NoteFieldActions';
import { getDefaultNoteFields } from '../data/DataNoteFields';
import { filterObjects } from '../utils/CategoryUtils';

function withNoteFields(Component) {
    function WithNoteFields(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        noteFields: getDefaultNoteFields(state.settings).concat(filterObjects(state.noteFields))
    });

    const mapDispatchToProps = dispatch => ({
        addNoteField: field => dispatch(addNoteField(field)),
        updateNoteField: field => dispatch(updateNoteField(field)),
        deleteNoteField: fieldId => dispatch(deleteNoteField(fieldId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithNoteFields);
}

export default withNoteFields;