import { connect } from 'react-redux';
import {
    loadData,
    saveData,
    synchronize,
    setSelectedView,
    setSelectedNoteIds,
    setSelectedNoteFilter,
    setSelectedTaskIds,
    setSelectedTaskFilter,
    setCategoryManagerOptions,
    setNoteFilterManagerOptions,
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
import withBusyCheck from '../components/common/WithBusyCheck';

function withApp(Component) {
    const mapStateToProps = state => ({
        busy: state.processes.busy,
        pro: isValidLicense(state.settings.license),
        selectedView: state.app.selectedView,
        selectedNoteIds: state.app.selectedNoteIds,
        selectedNoteFilter: state.app.selectedNoteFilter,
        selectedTaskIds: state.app.selectedTaskIds,
        selectedTaskFilter: state.app.selectedTaskFilter,
        categoryManager: state.app.categoryManager,
        noteFilterManager: state.app.noteFilterManager,
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
        setSelectedView: view => dispatch(setSelectedView(view)),
        setSelectedNoteIds: noteIds => dispatch(setSelectedNoteIds(noteIds)),
        setSelectedNoteFilter: noteFilter => dispatch(setSelectedNoteFilter(noteFilter)),
        setSelectedTaskIds: taskIds => dispatch(setSelectedTaskIds(taskIds)),
        setSelectedTaskFilter: taskFilter => dispatch(setSelectedTaskFilter(taskFilter)),
        setCategoryManagerOptions: options => dispatch(setCategoryManagerOptions(options)),
        setNoteFilterManagerOptions: options => dispatch(setNoteFilterManagerOptions(options)),
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
    )(withBusyCheck(Component));
}

export default withApp;