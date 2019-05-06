import { connect } from 'react-redux';
import { addNote, deleteNote, setSelectedNoteIds, setSelectedNoteFilter, updateNote } from 'actions/NoteActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { merge } from 'utils/ObjectUtils';

function withNotes(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true,
        applySelectedNoteFilter: false
    }, options || {});

    const mapStateToProps = state => {
        let notes = state.notes.filteredByVisibleState;

        if (options.applySelectedNoteFilter === true) {
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
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withNotes;