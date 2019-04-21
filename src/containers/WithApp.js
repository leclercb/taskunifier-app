import React from 'react';
import { connect } from 'react-redux';
import {
    setSelectedTaskIds,
    setSelectedTaskFilter,
    synchronize,
    loadData,
    saveData,
    setCategoryManagerOptions,
    setTaskFilterManagerOptions,
    setTaskTemplateManagerOptions,
    setSettingManagerOptions,
    setBatchAddTasksOptions
} from '../actions/AppActions';
import {
    backupData,
    cleanBackups
} from '../actions/BackupActions';
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
        selectedTaskFilter: state.app.selectedTaskFilter,
        categoryManager: state.app.categoryManager,
        taskFilterManager: state.app.taskFilterManager,
        taskTemplateManager: state.app.taskTemplateManager,
        settingManager: state.app.settingManager,
        batchAddTasks: state.app.batchAddTasks
    });

    const mapDispatchToProps = dispatch => ({
        loadData: options => dispatch(loadData(options)),
        saveData: options => dispatch(saveData(options)),
        backupData: () => dispatch(backupData()),
        cleanBackups: () => dispatch(cleanBackups()),
        synchronize: () => dispatch(synchronize()),
        setSelectedTaskIds: taskIds => dispatch(setSelectedTaskIds(taskIds)),
        setSelectedTaskFilter: taskFilter => dispatch(setSelectedTaskFilter(taskFilter)),
        setCategoryManagerOptions: options => dispatch(setCategoryManagerOptions(options)),
        setTaskFilterManagerOptions: options => dispatch(setTaskFilterManagerOptions(options)),
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