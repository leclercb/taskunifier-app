import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withLocation(Component, propertyId = 'locationId') {
    const mapStateToProps = (state, ownProps) => ({
        busy: state.processes.busy,
        location: filterObjects(state.locations).find(location => location.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withLocation;