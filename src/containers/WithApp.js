import { connect } from 'react-redux';
import {
    loadData,
    saveData,
    setBatchAddTasksOptions,
    setCategoryManagerOptions,
    setNoteFilterManagerOptions,
    setSelectedView,
    setSettingManagerOptions,
    setTaskEditionManagerOptions,
    setTaskFilterManagerOptions,
    setTaskTemplateManagerOptions,
    synchronize
} from 'actions/AppActions';
import {
    backupData,
    cleanBackups
} from 'actions/BackupActions';
import { updateSettings } from 'actions/SettingActions';
import { clearProcesses, setProcessesVisible } from 'actions/ProcessActions';
import { isValidLicense } from 'utils/LicenseUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withApp(Component) {
    const mapStateToProps = state => ({
        pro: isValidLicense(state.settings.license),
        selectedView: state.app.selectedView,
        categoryManager: state.app.categoryManager,
        noteFilterManager: state.app.noteFilterManager,
        taskFilterManager: state.app.taskFilterManager,
        taskEditionManager: state.app.taskEditionManager,
        taskTemplateManager: state.app.taskTemplateManager,
        settingManager: state.app.settingManager,
        batchAddTasks: state.app.batchAddTasks
    });

    const mapDispatchToProps = dispatch => ({
        loadData: () => dispatch(loadData()),
        saveData: options => dispatch(saveData(options)),
        backupData: () => dispatch(backupData()),
        cleanBackups: () => dispatch(cleanBackups()),
        synchronize: () => dispatch(synchronize()),
        setSelectedView: view => dispatch(setSelectedView(view)),
        setCategoryManagerOptions: options => dispatch(setCategoryManagerOptions(options)),
        setNoteFilterManagerOptions: options => dispatch(setNoteFilterManagerOptions(options)),
        setTaskFilterManagerOptions: options => dispatch(setTaskFilterManagerOptions(options)),
        setTaskEditionManagerOptions: options => dispatch(setTaskEditionManagerOptions(options)),
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
    )(withBusyCheck(Component));
}

export default withApp;