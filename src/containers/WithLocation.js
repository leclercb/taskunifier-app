import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';

function withLocation(Component, propertyId = 'locationId') {
    function WithLocation(props) {
        return <Component {...props} />
    }

    WithLocation.propTypes = {
        [propertyId]: PropTypes.string.isRequired
    }

    const mapStateToProps = (state, ownProps) => ({
        location: filterObjects(state.locations).find(location => location.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithLocation);
}

export default withLocation;