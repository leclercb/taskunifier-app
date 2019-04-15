import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Row, Col, Empty, Tabs } from 'antd';
import withFilters from '../../containers/WithFilters';
import FilterList from './FilterList';
import FilterConditionTree from './FilterConditionTree';
import FilterForm from './FilterForm';

function FilterManager(props) {
    const selectedFilterId = props.filterId;

    const onAddFilter = filter => {
        props.addFilter(filter).then(id => props.onFilterSelection(id));
    }

    const onFilterSelection = filter => {
        props.onFilterSelection(filter.id);
    }

    const selectedFilter = props.filters.find(filter => filter.id === selectedFilterId);

    return (
        <Row>
            <Col span={6}>
                <FilterList
                    filters={props.filters}
                    selectedFilterId={selectedFilterId}
                    addFilter={onAddFilter}
                    deleteFilter={props.deleteFilter}
                    onFilterSelection={onFilterSelection} />
            </Col>
            <Col span={2}>

            </Col>
            <Col span={16}>
                {selectedFilter ? (
                    <React.Fragment>
                        <FilterForm key={selectedFilterId} filter={selectedFilter} updateFilter={props.updateFilter} />
                        <Divider />
                        <FilterConditionTree key={'condition_tree_' + selectedFilterId} filter={selectedFilter} updateFilter={props.updateFilter} />
                    </React.Fragment>
                ) : <Empty description="Please select a filter" />}
            </Col>
        </Row>
    );
}

FilterManager.propTypes = {
    filterId: PropTypes.string,
    onFilterSelection: PropTypes.func.isRequired
};

export default withFilters(FilterManager);