import { connect } from 'react-redux';
import { buyItem } from 'actions/ItemActions';
import { check, login, logout } from 'actions/SessionActions';
import { getSession } from 'selectors/SessionSelectors';

function withSession(Component) {
    const mapStateToProps = state => ({
        session: getSession(state)
    });

    const mapDispatchToProps = dispatch => ({
        check: () => dispatch(check()),
        login: () => dispatch(login()),
        logout: () => dispatch(logout()),
        buyItem: (itemSku, user, email) => dispatch(buyItem(itemSku, user, email))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(Component);
}

export default withSession;