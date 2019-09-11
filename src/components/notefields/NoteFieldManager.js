import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withNoteFields from 'containers/WithNoteFields';
import withProCheck from 'containers/WithProCheck';
import FieldList from 'components/fields/FieldList';
import FieldForm from 'components/fields/FieldForm';
import { useNotes } from 'hooks/UseNotes';
import { FieldPropType } from 'proptypes/FieldPropTypes';

function NoteFieldManager(props) {
    const noteApi = useNotes();
    const selectedNoteFieldId = props.noteFieldId;

    const onAddNoteField = async noteField => {
        noteField = await props.addNoteField(noteField);
        props.onNoteFieldSelection(noteField.id);
    };

    const onDuplicateNoteField = async noteField => {
        noteField = await props.duplicateNoteField(noteField);
        props.onNoteFieldSelection(noteField.id);
    };

    const onNoteFieldSelection = noteField => {
        props.onNoteFieldSelection(noteField.id);
    };

    const selectedNoteField = props.noteFields.find(noteField => noteField.id === selectedNoteFieldId);

    return (
        <Row>
            <Col span={6}>
                <FieldList
                    fields={props.noteFields}
                    selectedFieldId={selectedNoteFieldId}
                    addField={onAddNoteField}
                    duplicateNoteField={onDuplicateNoteField}
                    deleteField={props.deleteNoteField}
                    onFieldSelection={onNoteFieldSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedNoteField ? (
                    <FieldForm
                        key={selectedNoteFieldId}
                        objects={noteApi.notes}
                        field={selectedNoteField}
                        updateField={props.updateNoteField} />
                ) : <Empty description="Please select a note field" />}
            </Col>
        </Row>
    );
}

NoteFieldManager.propTypes = {
    noteFieldId: PropTypes.string,
    noteFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    onNoteFieldSelection: PropTypes.func.isRequired,
    addNoteField: PropTypes.func.isRequired,
    duplicateNoteField: PropTypes.func.isRequired,
    updateNoteField: PropTypes.func.isRequired,
    deleteNoteField: PropTypes.func.isRequired
};

export default withProCheck(withNoteFields(NoteFieldManager));