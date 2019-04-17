import React from 'react';
import { connect } from 'react-redux';
import { addLocation, updateLocation, deleteLocation } from '../actions/LocationActions';
import { filterObjects } from '../utils/CategoryUtils';

function withLocations(Component, options = { actionsOnly: false }) {
    function WithLocations(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        return {
            locations: filterObjects(state.locations)
        };
    };

    const mapDispatchToProps = dispatch => ({
        addLocation: location => dispatch(addLocation(location)),
        updateLocation: location => dispatch(updateLocation(location)),
        deleteLocation: locationId => dispatch(deleteLocation(locationId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithLocations);
}

export default withLocations;