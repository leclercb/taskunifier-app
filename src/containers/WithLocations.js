import { connect } from 'react-redux';
import { addLocation, deleteLocation, duplicateLocation, updateLocation } from 'actions/LocationActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';
import { merge } from 'utils/ObjectUtils';

function withLocations(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true
    }, options || {});

    const mapStateToProps = state => ({
        locations: getLocationsFilteredByVisibleState(state)
    });

    const mapDispatchToProps = dispatch => ({
        addLocation: location => dispatch(addLocation(location)),
        duplicateLocation: location => dispatch(duplicateLocation(location)),
        updateLocation: location => dispatch(updateLocation(location)),
        deleteLocation: locationId => dispatch(deleteLocation(locationId))
    });

    return connect(
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withLocations;