import { connect } from 'react-redux';
import { addNoteFilter, updateNoteFilter, deleteNoteFilter } from '../actions/NoteFilterActions';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withNoteFilters(Component) {
    const mapStateToProps = state => ({
        noteFilters: filterObjects(state.noteFilters)
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