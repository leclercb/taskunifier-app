import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';

function withNoteField(Component, getId = ownProps => ownProps.noteFieldId) {
    const mapStateToProps = (state, ownProps) => ({
        noteField: getNoteFieldsIncludingDefaults(state).find(noteField => noteField.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withNoteField;