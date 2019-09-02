import { connect } from 'react-redux';
import { getAccountInfo, synchronize } from 'actions/SynchronizationActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getSynchronization } from 'selectors/SynchronizationSelectors';

function withSynchronization(Component) {
    const mapStateToProps = state => ({
        synchronization: getSynchronization(state)
    });

    const mapDispatchToProps = dispatch => ({
        synchronize: () => dispatch(synchronize()),
        getAccountInfo: () => dispatch(getAccountInfo())
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withSynchronization;