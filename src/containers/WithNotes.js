import moment from 'moment';
import { connect } from 'react-redux';
import { addNote, deleteNote, updateNote } from 'actions/NoteActions';
import { getDefaultNoteFields } from 'data/DataNoteFields';
import { filterObjects } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';
import { setSelectedNoteIds } from 'actions/AppActions';
import withBusyCheck from 'containers/WithBusyCheck';

function withNotes(Component, options = { applySelectedNoteFilter: false, actionsOnly: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        let notes = filterObjects(state.notes.all);

        if (options && options.applySelectedNoteFilter === true) {
            const fields = getDefaultNoteFields().concat(filterObjects(state.noteFields.all));

            notes = notes.filter(note => {
                if (!state.app.selectedNoteFilterDate ||
                    moment(note.creationDate).isAfter(moment(state.app.selectedNoteFilterDate))) {
                    return true;
                }

                return applyFilter(state.app.selectedNoteFilter, note, fields);
            });
        }

        return {
            notes: notes,
            selectedNoteIds: state.app.selectedNoteIds
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