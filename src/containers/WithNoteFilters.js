import React from 'react';
import { connect } from 'react-redux';
import { addNoteFilter, updateNoteFilter, deleteNoteFilter } from '../actions/NoteFilterActions';
import { filterObjects } from '../utils/CategoryUtils';

function withNoteFilters(Component) {
    function WithNoteFilters(props) {
        return <Component {...props} />
    }

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
    )(WithNoteFilters);
}

export default withNoteFilters;