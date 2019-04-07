import React from 'react';
import { connect } from 'react-redux';
import { addFilter, updateFilter, deleteFilter } from '../actions/FilterActions';

const mapStateToProps = state => ({
    filters: state.filters
});

const mapDispatchToProps = dispatch => ({
    addFilter: field => dispatch(addFilter(field)),
    updateFilter: field => dispatch(updateFilter(field)),
    deleteFilter: fieldId => dispatch(deleteFilter(fieldId))
});

function withFilters(Component) {
    function WithFilters(props) {
        return <Component {...props} />
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithFilters);
}

export default withFilters;