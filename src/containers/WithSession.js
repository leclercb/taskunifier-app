import { connect } from 'react-redux';
import { check, login, logout } from 'actions/SessionActions';
import { getSession } from 'selectors/SessionSelectors';

function withSession(Component) {
    const mapStateToProps = state => ({
        session: getSession(state)
    });

    const mapDispatchToProps = dispatch => ({
        check: () => dispatch(check()),
        login: () => dispatch(login()),
        logout: () => dispatch(logout())
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(Component);
}

export default withSession;