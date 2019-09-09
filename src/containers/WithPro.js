import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { isPro } from 'selectors/AppSelectors';

function withPro(Component) {
    const mapStateToProps = state => ({
        pro: isPro(state)
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withPro;