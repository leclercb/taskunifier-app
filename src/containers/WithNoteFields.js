import { connect } from 'react-redux';
import { addNoteField, deleteNoteField, updateNoteField } from 'actions/NoteFieldActions';
import { getDefaultNoteFields } from 'data/DataNoteFields';
import withBusyCheck from 'containers/WithBusyCheck';

function withNoteFields(Component) {
    const mapStateToProps = state => ({
        noteFields: getDefaultNoteFields().concat(state.noteFields.filteredByVisibleState)
    });

    const mapDispatchToProps = dispatch => ({
        addNoteField: field => dispatch(addNoteField(field)),
        updateNoteField: field => dispatch(updateNoteField(field)),
        deleteNoteField: fieldId => dispatch(deleteNoteField(fieldId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withNoteFields;