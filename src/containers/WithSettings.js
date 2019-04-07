import React from 'react';
import { connect } from 'react-redux';
import { updateSettings, setSettingsVisible } from '../actions/SettingActions';

const mapStateToProps = state => ({
    settings: state.settings
});

const mapDispatchToProps = dispatch => ({
    setSettingsVisible: visible => dispatch(setSettingsVisible(visible)),
    updateSettings: task => dispatch(updateSettings(task))
});

function withSettings(Component) {
    function WithSettings(props) {
        return <Component {...props} />
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithSettings);
}

export default withSettings;