import React from 'react';
import { Col, Divider, Empty, Row } from 'antd';
import PropTypes from 'prop-types';
import FilterConditionTree from 'components/filters/FilterConditionTree';
import FilterList from 'components/filters/FilterList';
import FilterForm from 'components/filters/FilterForm';
import SorterTable from 'components/filters/SorterTable';
import withNoteFields from 'containers/WithNoteFields';
import withNoteFilters from 'containers/WithNoteFilters';
import withProCheck from 'containers/WithProCheck';
import { NoteFilterPropType } from 'proptypes/NoteFilterPropTypes';
import { getNoteSorterFields } from 'data/DataNoteSorterFields';
import { FieldPropType } from 'proptypes/FieldPropTypes';

function NoteFilterManager(props) {
    const selectedNoteFilterId = props.noteFilterId;

    const onAddNoteFilter = noteFilter => {
        props.addNoteFilter(noteFilter).then(noteFilter => props.onNoteFilterSelection(noteFilter.id));
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
                <FilterList
                    filters={props.noteFilters}
                    selectedFilterId={selectedNoteFilterId}
                    addFilter={onAddNoteFilter}
                    deleteFilter={props.deleteNoteFilter}
                    onFilterSelection={onNoteFilterSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedNoteFilter ? (
                    <React.Fragment>
                        <FilterForm
                            key={selectedNoteFilterId}
                            filter={selectedNoteFilter}
                            updateFilter={props.updateNoteFilter} />
                        <Divider>Filters</Divider>
                        <FilterConditionTree
                            key={'conditionTree_' + selectedNoteFilterId}
                            filter={selectedNoteFilter}
                            context={{
                                fields: props.noteFields
                            }}
                            updateFilter={props.updateNoteFilter} />
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
    noteFilters: PropTypes.arrayOf(NoteFilterPropType.isRequired).isRequired,
    noteFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    onNoteFilterSelection: PropTypes.func.isRequired,
    addNoteFilter: PropTypes.func.isRequired,
    updateNoteFilter: PropTypes.func.isRequired,
    deleteNoteFilter: PropTypes.func.isRequired
};

export default withProCheck(withNoteFields(withNoteFilters(NoteFilterManager)));