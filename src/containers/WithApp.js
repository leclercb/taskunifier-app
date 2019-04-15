import React from 'react';
import { connect } from 'react-redux';
import { backupData, setSelectedFilter, synchronize, loadData, saveData, setCategoryManagerOptions, setFilterManagerOptions, cleanBackups } from '../actions/AppActions';
import { setSettingsVisible, updateSettings } from '../actions/SettingActions';
import { clearProcesses, setStatusVisible } from '../actions/StatusActions';
import { isValidLicense } from '../utils/LicenseUtils';

function withApp(Component) {
    function WithApp(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        pro: isValidLicense(state.settings.data.license),
        selectedFilter: state.app.selectedFilter,
        categoryManager: state.app.categoryManager,
        filterManager: state.app.filterManager
    });

    const mapDispatchToProps = dispatch => ({
        loadData: options => dispatch(loadData(options)),
        saveData: options => dispatch(saveData(options)),
        backupData: () => dispatch(backupData()),
        cleanBackups: nbBackupstoKeep => dispatch(cleanBackups(nbBackupstoKeep)),
        synchronize: () => dispatch(synchronize()),
        setSelectedFilter: filter => dispatch(setSelectedFilter(filter)),
        setCategoryManagerOptions: options => dispatch(setCategoryManagerOptions(options)),
        setFilterManagerOptions: options => dispatch(setFilterManagerOptions(options)),
        setStatusVisible: visible => dispatch(setStatusVisible(visible)),
        clearProcesses: () => dispatch(clearProcesses()),
        setSettingsVisible: visible => dispatch(setSettingsVisible(visible)),
        updateSettings: settings => dispatch(updateSettings(settings))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithApp);
}

export default withApp;