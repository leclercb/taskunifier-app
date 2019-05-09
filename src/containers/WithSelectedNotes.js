import { connect } from 'react-redux';
import { addNote, deleteNote, setSelectedNoteIds, updateNote } from 'actions/NoteActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getSelectedNoteIds } from 'selectors/AppSelectors';
import { getNotesFilteredByVisibleState } from 'selectors/NoteSelectors';

function withSelectedNotes(Component) {
    const mapStateToProps = state => ({
        selectedNoteIds: getSelectedNoteIds(state),
        selectedNotes: getNotesFilteredByVisibleState(state).filter(note => getSelectedNoteIds(state).includes(note.id))
    });

    const mapDispatchToProps = dispatch => ({
        addNote: note => dispatch(addNote(note)),
        updateNote: note => dispatch(updateNote(note)),
        deleteNote: noteId => dispatch(deleteNote(noteId)),
        setSelectedNoteIds: noteIds => dispatch(setSelectedNoteIds(noteIds))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withSelectedNotes;