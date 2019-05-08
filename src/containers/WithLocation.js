import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';

function withLocation(Component, getId = ownProps => ownProps.locationId) {
    const mapStateToProps = (state, ownProps) => ({
        location: getLocationsFilteredByVisibleState(state).find(location => location.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withLocation;