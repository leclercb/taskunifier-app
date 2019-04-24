import { connect } from 'react-redux';
import { updateSettings } from '../actions/SettingActions';
import withBusyCheck from 'containers/WithBusyCheck';

function withSettings(Component) {
    const mapStateToProps = state => ({
        settings: state.settings
    });

    const mapDispatchToProps = dispatch => ({
        updateSettings: task => dispatch(updateSettings(task))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withSettings;