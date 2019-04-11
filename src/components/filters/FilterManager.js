import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Empty } from 'antd';
import withFilters from '../../containers/WithFilters';
import FilterList from './FilterList';
import FilterConditionTree from './FilterConditionTree';

function FilterManager(props) {
    const selectedFilterId = props.filterId;

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
                    addFilter={props.addFilter}
                    deleteFilter={props.deleteFilter}
                    onFilterSelection={onFilterSelection} />
            </Col>
            <Col span={2}>

            </Col>
            <Col span={16}>
                {selectedFilter ? (
                    <FilterConditionTree key={selectedFilterId} filter={selectedFilter} updateFilter={props.updateFilter} />
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