import { connect } from 'react-redux';
import { addNoteFilter, deleteNoteFilter, updateNoteFilter } from 'actions/NoteFilterActions';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withNoteFilters(Component) {
    const mapStateToProps = state => ({
        noteFilters: filterObjects(state.noteFilters.all)
    });

    const mapDispatchToProps = dispatch => ({
        addNoteFilter: noteFilter => dispatch(addNoteFilter(noteFilter)),
        updateNoteFilter: noteFilter => dispatch(updateNoteFilter(noteFilter)),
        deleteNoteFilter: noteFilterId => dispatch(deleteNoteFilter(noteFilterId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withNoteFilters;