import { connect } from 'react-redux';
import { addLocation, deleteLocation, updateLocation } from 'actions/LocationActions';
import withBusyCheck from 'containers/WithBusyCheck';

function withLocations(Component, options = { actionsOnly: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        return {
            locations: state.locations.filteredByVisibleState
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
    )(withBusyCheck(Component));
}

export default withLocations;