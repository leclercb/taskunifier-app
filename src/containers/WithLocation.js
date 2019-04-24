import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withLocation(Component, propertyId = 'locationId') {
    const mapStateToProps = (state, ownProps) => ({
        location: filterObjects(state.locations).find(location => location.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withLocation;