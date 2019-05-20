import { connect } from 'react-redux';
import { updateSettings } from 'actions/SettingActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getSettings } from 'selectors/SettingSelectors';
import { merge } from 'utils/ObjectUtils';

function withSettings(Component, options) {
    options = merge({
        includeDispatcher: false
    }, options || {});

    const mapStateToProps = state => ({
        settings: getSettings(state)
    });

    const mapDispatchToProps = dispatch => {
        const data = {
            updateSettings: task => dispatch(updateSettings(task))
        };

        if (options.includeDispatcher) {
            data.dispatcher = action => dispatch(action);
        }

        return data;
    };

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withSettings;