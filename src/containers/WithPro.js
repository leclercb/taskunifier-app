import { connect } from 'react-redux';
import { isValidLicense } from '../utils/LicenseUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withPro(Component) {
    const mapStateToProps = state => ({
        pro: isValidLicense(state.settings.license)
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withPro;