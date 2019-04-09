import React from 'react';
import { connect } from 'react-redux';
import { backupData, setSelectedFilter, synchronize, loadData, saveData, setCategoryManagerOptions, setFilterManagerOptions } from '../actions/AppActions';
import { setSettingsVisible } from '../actions/SettingActions';
import { clearProcesses } from '../actions/StatusActions';

const mapStateToProps = state => ({
    selectedFilter: state.app.selectedFilter,
    categoryManager: state.app.categoryManager,
    filterManager: state.app.filterManager
})

const mapDispatchToProps = dispatch => ({
    loadData: () => dispatch(loadData()),
    saveData: () => dispatch(saveData()),
    backupData: () => dispatch(backupData()),
    synchronize: () => dispatch(synchronize()),
    setSelectedFilter: filter => dispatch(setSelectedFilter(filter)),
    setSettingsVisible: visible => dispatch(setSettingsVisible(visible)),
    setCategoryManagerOptions: options => dispatch(setCategoryManagerOptions(options)),
    setFilterManagerOptions: options => dispatch(setFilterManagerOptions(options)),
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