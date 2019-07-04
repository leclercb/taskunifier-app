import { connect } from 'react-redux';
import { synchronize } from 'actions/SynchronizationActions';
import { getAccountInfo } from 'actions/toodledo/AccountInfo';
import { authorize, createToken, refreshToken } from 'actions/toodledo/Authorization';
import withBusyCheck from 'containers/WithBusyCheck';
import { getToodledoData } from 'selectors/SynchronizationSelectors';

function withSynchronization(Component) {
    const mapStateToProps = state => ({
        toodledo: getToodledoData(state)
    });

    const mapDispatchToProps = dispatch => ({
        synchronize: () => dispatch(synchronize()),
        authorize: () => dispatch(authorize()),
        createToken: code => dispatch(createToken(code)),
        refreshToken: () => dispatch(refreshToken()),
        getAccountInfo: () => dispatch(getAccountInfo())
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withSynchronization;