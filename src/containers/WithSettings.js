import React from 'react';
import { connect } from 'react-redux';
import { updateSettings } from '../actions/SettingActions';

function withSettings(Component) {
    function WithSettings(props) {
        return <Component {...props} getSetting={key => props.settings[key]} />
    }

    const mapStateToProps = state => ({
        settings: state.settings
    });

    const mapDispatchToProps = dispatch => ({
        updateSettings: task => dispatch(updateSettings(task))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithSettings);
}

export default withSettings;