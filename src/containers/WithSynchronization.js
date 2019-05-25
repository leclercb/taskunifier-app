import { connect } from 'react-redux';
import { getAccountInfo } from 'actions/toodledo/AccountInfo';
import { authorize, getToken, getRefreshedToken } from 'actions/toodledo/Authorization';
import withBusyCheck from 'containers/WithBusyCheck';

function withSynchronization(Component) {
    const mapDispatchToProps = dispatch => ({
        authorize: () => dispatch(authorize()),
        getToken: code => dispatch(getToken(code)),
        refreshToken: refreshToken => dispatch(getRefreshedToken(refreshToken)),
        getAccountInfo: accessToken => dispatch(getAccountInfo(accessToken))
    });

    return connect(
        null,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withSynchronization;