import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withLocation(Component, propertyId = 'locationId') {
    const mapStateToProps = (state, ownProps) => ({
        location: state.locations.filteredByVisibleState.find(location => location.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withLocation;