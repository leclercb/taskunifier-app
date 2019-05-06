import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { updateNote } from 'actions/NoteActions';

function withNote(Component, getId = ownProps => ownProps.noteId) {
    const mapStateToProps = (state, ownProps) => ({
        note: state.notes.filteredByVisibleState.find(note => note.id === getId(ownProps))
    });

    const mapDispatchToProps = dispatch => ({
        updateNote: note => dispatch(updateNote(note))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withNote;