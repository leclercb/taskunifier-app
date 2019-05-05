import { connect } from 'react-redux';
import { addNote, deleteNote, setSelectedNoteIds, setSelectedNoteFilter, updateNote } from 'actions/NoteActions';
import withBusyCheck from 'containers/WithBusyCheck';

function withNotes(Component, options = { applySelectedNoteFilter: false, actionsOnly: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        let notes = state.notes.filteredByVisibleState;

        if (options && options.applySelectedNoteFilter === true) {
            notes = state.notes.filteredBySelectedFilter;
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
        setSelectedNoteIds: noteIds => dispatch(setSelectedNoteIds(noteIds)),
        setSelectedNoteFilter: noteFilter => dispatch(setSelectedNoteFilter(noteFilter))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withNotes;