import { connect } from 'react-redux';
import { isValidLicense } from '../utils/LicenseUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withPro(Component) {
    const mapStateToProps = state => ({
        busy: state.processes.busy,
        pro: isValidLicense(state.settings.license)
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withPro;