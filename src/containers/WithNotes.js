import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { addNote, updateNote, deleteNote } from '../actions/NoteActions';
import { getDefaultNoteFields } from '../data/DataNoteFields';
import { filterObjects } from '../utils/CategoryUtils';
import { applyFilter } from '../utils/FilterUtils';
import { setSelectedNoteIds } from '../actions/AppActions';

function withNotes(Component, options = { applySelectedNoteFilter: false, actionsOnly: false }) {
    function WithNotes(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        let notes = filterObjects(state.notes);

        if (options && options.applySelectedNoteFilter === true) {
            const fields = getDefaultNoteFields(state.settings).concat(filterObjects(state.noteFields));

            notes = notes.filter(note => {
                if (!state.app.selectedNoteFilterDate ||
                    moment(note.creationDate).isAfter(moment(state.app.selectedNoteFilterDate))) {
                    return true;
                }

                return applyFilter(state.app.selectedNoteFilter, note, fields);
            });
        }

        return {
            notes: notes
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
    )(WithNotes);
}

export default withNotes;