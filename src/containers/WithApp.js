import React from 'react';
import { connect } from 'react-redux';
import { backupData, setSelectedFilter, synchronize, loadData, saveData, setCategoryManagerVisible } from '../actions/AppActions';
import { setSettingsVisible } from '../actions/SettingActions';
import { clearProcesses } from '../actions/StatusActions';

const mapStateToProps = state => ({
    selectedFilter: state.app.selectedFilter,
    categoryManagerVisible: state.app.categoryManagerVisible
})

const mapDispatchToProps = dispatch => ({
    loadData: () => dispatch(loadData()),
    saveData: () => dispatch(saveData()),
    backupData: () => dispatch(backupData()),
    synchronize: () => dispatch(synchronize()),
    setSelectedFilter: filter => dispatch(setSelectedFilter(filter)),
    setSettingsVisible: visible => dispatch(setSettingsVisible(visible)),
    setCategoryManagerVisible: visible => dispatch(setCategoryManagerVisible(visible)),
    clearProcesses: () => dispatch(clearProcesses())
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