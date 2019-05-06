import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withLocation(Component, getId = ownProps => ownProps.locationId) {
    const mapStateToProps = (state, ownProps) => ({
        location: state.locations.filteredByVisibleState.find(location => location.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withLocation;