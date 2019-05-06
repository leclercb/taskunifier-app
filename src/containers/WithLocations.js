import { connect } from 'react-redux';
import { addLocation, deleteLocation, updateLocation } from 'actions/LocationActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { merge } from 'utils/ObjectUtils';

function withLocations(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true
    }, options || {});

    const mapStateToProps = state => ({
        locations: state.locations.filteredByVisibleState
    });

    const mapDispatchToProps = dispatch => ({
        addLocation: location => dispatch(addLocation(location)),
        updateLocation: location => dispatch(updateLocation(location)),
        deleteLocation: locationId => dispatch(deleteLocation(locationId))
    });

    return connect(
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withLocations;