import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Row, Col, Empty } from 'antd';
import withNoteFilters from '../../containers/WithNoteFilters';
import NoteFilterList from 'components/notefilters/NoteFilterList';
import NoteFilterConditionTree from 'components/notefilters/NoteFilterConditionTree';
import NoteFilterForm from 'components/notefilters/NoteFilterForm';

function NoteFilterManager(props) {
    const selectedNoteFilterId = props.noteFilterId;

    const onAddNoteFilter = noteFilter => {
        props.addNoteFilter(noteFilter).then(id => props.onNoteFilterSelection(id));
    };

    const onNoteFilterSelection = noteFilter => {
        props.onNoteFilterSelection(noteFilter.id);
    };

    const selectedNoteFilter = props.noteFilters.find(noteFilter => noteFilter.id === selectedNoteFilterId);

    return (
        <Row>
            <Col span={6}>
                <NoteFilterList
                    noteFilters={props.noteFilters}
                    selectedNoteFilterId={selectedNoteFilterId}
                    addNoteFilter={onAddNoteFilter}
                    deleteNoteFilter={props.deleteNoteFilter}
                    onNoteFilterSelection={onNoteFilterSelection} />
            </Col>
            <Col span={2}>

            </Col>
            <Col span={16}>
                {selectedNoteFilter ? (
                    <React.Fragment>
                        <NoteFilterForm 
                        key={selectedNoteFilterId} 
                        noteFilter={selectedNoteFilter} 
                        updateNoteFilter={props.updateNoteFilter} />
                        <Divider />
                        <NoteFilterConditionTree 
                        key={'conditionTree_' + selectedNoteFilterId} 
                        noteFilter={selectedNoteFilter} 
                        updateNoteFilter={props.updateNoteFilter} />
                    </React.Fragment>
                ) : <Empty description="Please select a note filter" />}
            </Col>
        </Row>
    );
}

NoteFilterManager.propTypes = {
    noteFilterId: PropTypes.string,
    onNoteFilterSelection: PropTypes.func.isRequired
};

export default withNoteFilters(NoteFilterManager);