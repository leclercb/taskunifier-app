import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withProCheck from 'containers/WithProCheck';
import FieldList from 'components/fields/FieldList';
import FieldForm from 'components/fields/FieldForm';
import { useNoteApi } from 'hooks/UseNoteApi';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';

function NoteFieldManager(props) {
    const noteApi = useNoteApi();
    const noteFieldApi = useNoteFieldApi();
    const selectedNoteFieldId = props.noteFieldId;

    const onAddNoteField = async noteField => {
        noteField = await noteFieldApi.addNoteField(noteField);
        props.onNoteFieldSelection(noteField.id);
    };

    const onDuplicateNoteField = async noteField => {
        noteField = await noteFieldApi.duplicateNoteField(noteField);
        props.onNoteFieldSelection(noteField.id);
    };

    const onNoteFieldSelection = noteField => {
        props.onNoteFieldSelection(noteField.id);
    };

    const selectedNoteField = noteFieldApi.noteFields.find(noteField => noteField.id === selectedNoteFieldId);

    return (
        <Row>
            <Col span={6}>
                <FieldList
                    fields={noteFieldApi.noteFields}
                    selectedFieldId={selectedNoteFieldId}
                    addField={onAddNoteField}
                    duplicateField={onDuplicateNoteField}
                    deleteField={noteFieldApi.deleteNoteField}
                    onFieldSelection={onNoteFieldSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedNoteField ? (
                    <FieldForm
                        key={selectedNoteFieldId}
                        objects={noteApi.notes}
                        field={selectedNoteField}
                        updateField={noteFieldApi.updateNoteField} />
                ) : <Empty description="Please select a note field" />}
            </Col>
        </Row>
    );
}

NoteFieldManager.propTypes = {
    noteFieldId: PropTypes.string,
    onNoteFieldSelection: PropTypes.func.isRequired
};

export default withProCheck(NoteFieldManager);