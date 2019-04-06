import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    filters: state.filters
});

const mapDispatchToProps = dispatch => ({

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