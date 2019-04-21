import React from 'react';
import { connect } from 'react-redux';
import { addNote, updateNote, deleteNote } from '../actions/NoteActions';
import { filterObjects } from '../utils/CategoryUtils';
import { setSelectedNoteIds } from '../actions/AppActions';

function withSelectedNotes(Component) {
    function WithSelectedNotes(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        selectedNoteIds: state.app.selectedNoteIds,
        selectedNotes: filterObjects(state.notes.filter(note => state.app.selectedNoteIds.includes(note.id)))
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
    )(WithSelectedNotes);
}

export default withSelectedNotes;