import { connect } from 'react-redux';
import { updateNote } from 'actions/NoteActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getNotesFilteredByVisibleState } from 'selectors/NoteSelectors';

function withNote(Component, getId = ownProps => ownProps.noteId) {
    const mapStateToProps = (state, ownProps) => ({
        note: getNotesFilteredByVisibleState(state).find(note => note.id === getId(ownProps))
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