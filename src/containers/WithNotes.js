import { connect } from 'react-redux';
import { addNote, deleteNote, setSelectedNoteIds, updateNote } from 'actions/NoteActions';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withNotes(Component, options = { applySelectedNoteFilter: false, actionsOnly: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        let notes = filterObjects(state.notes.all);

        if (options && options.applySelectedNoteFilter === true) {
            notes = state.notes.filtered;
        }

        return {
            notes: notes,
            selectedNoteIds: state.notes.selectedNoteIds,
            selectedNoteFilter: state.notes.selectedNoteFilter
        };
    };

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

export default withNotes;