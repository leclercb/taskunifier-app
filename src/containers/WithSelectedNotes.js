import { connect } from 'react-redux';
import { addNote, deleteNote, setSelectedNoteIds, updateNote } from 'actions/NoteActions';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withSelectedNotes(Component) {
    const mapStateToProps = state => ({
        selectedNoteIds: state.notes.selectedNoteIds,
        selectedNotes: filterObjects(state.notes.all.filter(note => state.notes.selectedNoteIds.includes(note.id)))
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