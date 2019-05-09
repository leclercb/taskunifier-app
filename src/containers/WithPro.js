import { connect } from 'react-redux';
import { isValidLicense } from 'utils/LicenseUtils';
import withBusyCheck from 'containers/WithBusyCheck';
import { getSettings } from 'selectors/SettingSelectors';

function withPro(Component) {
    const mapStateToProps = state => ({
        pro: isValidLicense(getSettings(state).license)
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withPro;