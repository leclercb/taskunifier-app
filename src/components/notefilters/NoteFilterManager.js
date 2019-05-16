import React from 'react';
import { Col, Divider, Empty, Row } from 'antd';
import PropTypes from 'prop-types';
import NoteFilterConditionTree from 'components/notefilters/NoteFilterConditionTree';
import NoteFilterList from 'components/notefilters/NoteFilterList';
import NoteFilterForm from 'components/notefilters/NoteFilterForm';
import NoteSorterTable from 'components/notefilters/NoteSorterTable';
import withNoteFilters from 'containers/WithNoteFilters';
import { NoteFilterPropType } from 'proptypes/NoteFilterPropTypes';

function NoteFilterManager(props) {
    const selectedNoteFilterId = props.noteFilterId;

    const onAddNoteFilter = noteFilter => {
        props.addNoteFilter(noteFilter).then(id => props.onNoteFilterSelection(id));
    };

    const onNoteFilterSelection = noteFilter => {
        props.onNoteFilterSelection(noteFilter.id);
    };

    const onUpdateSorters = sorters => {
        props.updateNoteFilter({
            ...selectedNoteFilter,
            sorters
        });
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
                        <Divider />
                        <NoteSorterTable
                            key={'sorterTable_' + selectedNoteFilterId}
                            sorters={selectedNoteFilter.sorters || []}
                            updateSorters={onUpdateSorters} />
                    </React.Fragment>
                ) : <Empty description="Please select a note filter" />}
            </Col>
        </Row>
    );
}

NoteFilterManager.propTypes = {
    noteFilterId: PropTypes.string,
    noteFilters: PropTypes.arrayOf(NoteFilterPropType.isRequired).isRequired,
    onNoteFilterSelection: PropTypes.func.isRequired,
    addNoteFilter: PropTypes.func.isRequired,
    updateNoteFilter: PropTypes.func.isRequired,
    deleteNoteFilter: PropTypes.func.isRequired
};

export default withNoteFilters(NoteFilterManager);