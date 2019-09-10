import { connect } from 'react-redux';
import { addNoteFilter, deleteNoteFilter, duplicateNoteFilter, updateNoteFilter } from 'actions/NoteFilterActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getNoteFiltersFilteredByVisibleState } from 'selectors/NoteFilterSelectors';

function withNoteFilters(Component) {
    const mapStateToProps = state => ({
        noteFilters: getNoteFiltersFilteredByVisibleState(state)
    });

    const mapDispatchToProps = dispatch => ({
        addNoteFilter: noteFilter => dispatch(addNoteFilter(noteFilter)),
        duplicateNoteFilter: noteFilter => dispatch(duplicateNoteFilter(noteFilter)),
        updateNoteFilter: noteFilter => dispatch(updateNoteFilter(noteFilter)),
        deleteNoteFilter: noteFilterId => dispatch(deleteNoteFilter(noteFilterId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withNoteFilters;