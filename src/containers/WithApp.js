import React from 'react';
import { connect } from 'react-redux';
import { setSelectedFilter, synchronize, loadData, saveData } from '../actions/AppActions';
import { setSettingsVisible } from '../actions/SettingActions';
import { setStatusVisible } from '../actions/StatusActions';

const mapStateToProps = state => ({
    selectedFilter: state.app.selectedFilter
})

const mapDispatchToProps = dispatch => ({
    loadData: () => dispatch(loadData()),
    saveData: () => dispatch(saveData()),
    synchronize: () => dispatch(synchronize()),
    setSelectedFilter: filter => dispatch(setSelectedFilter(filter)),
    setSettingsVisible: visible => dispatch(setSettingsVisible(visible)),
    setStatusVisible: visible => dispatch(setStatusVisible(visible))
})

function withApp(Component) {
    function WithApp(props) {
        return <Component {...props} />
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithApp);
}

export default withApp;