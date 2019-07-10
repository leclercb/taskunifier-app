import { connect } from 'react-redux';
import { synchronize } from 'actions/SynchronizationActions';
import { getAccountInfo } from 'actions/toodledo/AccountInfo';
import withBusyCheck from 'containers/WithBusyCheck';
import { getToodledoData } from 'selectors/SynchronizationSelectors';

function withSynchronization(Component) {
    const mapStateToProps = state => ({
        toodledo: getToodledoData(state)
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