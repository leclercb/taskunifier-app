import React from 'react';
import { connect } from 'react-redux';
import {
    backupData,
    setSelectedTaskIds,
    setSelectedFilter,
    synchronize,
    loadData,
    saveData,
    cleanBackups,
    setCategoryManagerOptions,
    setFilterManagerOptions,
    setTaskTemplateManagerOptions,
    setSettingManagerOptions,
    setBatchAddTasksOptions
} from '../actions/AppActions';
import { updateSettings } from '../actions/SettingActions';
import { clearProcesses, setProcessesVisible } from '../actions/ProcessActions';
import { isValidLicense } from '../utils/LicenseUtils';

function withApp(Component) {
    function WithApp(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        pro: isValidLicense(state.settings.license),
        selectedTaskIds: state.app.selectedTaskIds,
        selectedFilter: state.app.selectedFilter,
        categoryManager: state.app.categoryManager,
        filterManager: state.app.filterManager,
        taskTemplateManager: state.app.taskTemplateManager,
        settingManager: state.app.settingManager,
        batchAddTasks: state.app.batchAddTasks
    });

    const mapDispatchToProps = dispatch => ({
        loadData: options => dispatch(loadData(options)),
        saveData: options => dispatch(saveData(options)),
        backupData: () => dispatch(backupData()),
        cleanBackups: nbBackupstoKeep => dispatch(cleanBackups(nbBackupstoKeep)),
        synchronize: () => dispatch(synchronize()),
        setSelectedTaskIds: taskIds => dispatch(setSelectedTaskIds(taskIds)),
        setSelectedFilter: filter => dispatch(setSelectedFilter(filter)),
        setCategoryManagerOptions: options => dispatch(setCategoryManagerOptions(options)),
        setFilterManagerOptions: options => dispatch(setFilterManagerOptions(options)),
        setTaskTemplateManagerOptions: options => dispatch(setTaskTemplateManagerOptions(options)),
        setSettingManagerOptions: options => dispatch(setSettingManagerOptions(options)),
        setBatchAddTasksOptions: options => dispatch(setBatchAddTasksOptions(options)),
        setProcessesVisible: visible => dispatch(setProcessesVisible(visible)),
        clearProcesses: () => dispatch(clearProcesses()),
        updateSettings: settings => dispatch(updateSettings(settings))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithApp);
}

export default withApp;