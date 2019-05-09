import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { isValidLicense } from 'selectors/AppSelectors';

function withPro(Component) {
    const mapStateToProps = state => ({
        pro: isValidLicense(state)
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withPro;