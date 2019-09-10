import { connect } from 'react-redux';
import { addNoteField, deleteNoteField, duplicateNoteField, updateNoteField } from 'actions/NoteFieldActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { merge } from 'utils/ObjectUtils';

function withNoteFields(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true
    }, options || {});

    const mapStateToProps = state => ({
        noteFields: getNoteFieldsIncludingDefaults(state)
    });

    const mapDispatchToProps = dispatch => ({
        addNoteField: field => dispatch(addNoteField(field)),
        duplicateNoteField: field => dispatch(duplicateNoteField(field)),
        updateNoteField: field => dispatch(updateNoteField(field)),
        deleteNoteField: fieldId => dispatch(deleteNoteField(fieldId))
    });

    return connect(
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withNoteFields;