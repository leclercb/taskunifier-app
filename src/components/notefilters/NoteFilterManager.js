import React from 'react';
import { Col, Divider, Empty, Row } from 'antd';
import PropTypes from 'prop-types';
import FilterConditionTree from 'components/filters/FilterConditionTree';
import FilterList from 'components/filters/FilterList';
import FilterForm from 'components/filters/FilterForm';
import SorterTable from 'components/filters/SorterTable';
import withProCheck from 'containers/WithProCheck';
import { getNoteSorterFields } from 'data/DataNoteSorterFields';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';
import { useNoteFilterApi } from 'hooks/UseNoteFilterApi';

function NoteFilterManager(props) {
    const noteFieldApi = useNoteFieldApi();
    const noteFilterApi = useNoteFilterApi();
    const selectedNoteFilterId = props.noteFilterId;

    const onAddNoteFilter = async noteFilter => {
        noteFilter = await noteFilterApi.addNoteFilter(noteFilter);
        props.onNoteFilterSelection(noteFilter.id);
    };

    const onDuplicateNoteFilter = async noteFilter => {
        noteFilter = await noteFilterApi.duplicateNoteFilter(noteFilter);
        props.onNoteFilterSelection(noteFilter.id);
    };

    const onNoteFilterSelection = noteFilter => {
        props.onNoteFilterSelection(noteFilter.id);
    };

    const onUpdateSorters = sorters => {
        noteFilterApi.updateNoteFilter({
            ...selectedNoteFilter,
            sorters
        });
    };

    const selectedNoteFilter = noteFilterApi.noteFilters.find(noteFilter => noteFilter.id === selectedNoteFilterId);

    return (
        <Row>
            <Col span={6}>
                <FilterList
                    filters={noteFilterApi.noteFilters}
                    selectedFilterId={selectedNoteFilterId}
                    addFilter={onAddNoteFilter}
                    duplicateFilter={onDuplicateNoteFilter}
                    deleteFilter={noteFilterApi.deleteNoteFilter}
                    onFilterSelection={onNoteFilterSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedNoteFilter ? (
                    <React.Fragment>
                        <FilterForm
                            key={selectedNoteFilterId}
                            filter={selectedNoteFilter}
                            updateFilter={noteFilterApi.updateNoteFilter} />
                        <Divider>Filters</Divider>
                        <FilterConditionTree
                            key={'conditionTree_' + selectedNoteFilterId}
                            filter={selectedNoteFilter}
                            context={{
                                fields: noteFieldApi.noteFields
                            }}
                            updateFilter={noteFilterApi.updateNoteFilter} />
                        <Divider>Sorters</Divider>
                        <SorterTable
                            key={'sorterTable_' + selectedNoteFilterId}
                            sorters={selectedNoteFilter.sorters || []}
                            sorterFields={getNoteSorterFields()}
                            updateSorters={onUpdateSorters}
                            orderSettingPrefix="noteSorterColumnOrder_"
                            widthSettingPrefix="noteSorterColumnWidth_" />
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

export default withProCheck(NoteFilterManager);