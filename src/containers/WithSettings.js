import React from 'react';
import { connect } from 'react-redux';
import { updateSettings, setSettingsVisible } from '../actions/SettingActions';

function withSettings(Component) {
    function WithSettings(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        settings: state.settings
    });

    const mapDispatchToProps = dispatch => ({
        setSettingsVisible: visible => dispatch(setSettingsVisible(visible)),
        updateSettings: task => dispatch(updateSettings(task))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithSettings);
}

export default withSettings;