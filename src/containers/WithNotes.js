import { connect } from 'react-redux';
import {
    addNote,
    deleteNote,
    setSelectedNoteFilter,
    setSelectedNoteIds,
    updateNote
} from 'actions/NoteActions';
import withBusyCheck from 'containers/WithBusyCheck';
import {
    getSelectedNoteFilter,
    getSelectedNoteIds
} from 'selectors/AppSelectors';
import {
    getNotesFilteredBySelectedFilter,
    getNotesFilteredByVisibleState
} from 'selectors/NoteSelectors';
import { merge } from 'utils/ObjectUtils';

function withNotes(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true,
        applySelectedNoteFilter: false
    }, options || {});

    const mapStateToProps = state => {
        let notes = getNotesFilteredByVisibleState(state);

        if (options.applySelectedNoteFilter === true) {
            notes = getNotesFilteredBySelectedFilter(state);
        }

        return {
            notes: notes,
            selectedNoteIds: getSelectedNoteIds(state),
            selectedNoteFilter: getSelectedNoteFilter(state)
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