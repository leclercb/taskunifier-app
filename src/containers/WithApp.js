import { connect } from 'react-redux';
import {
    loadData,
    saveData,
    setBatchAddTasksOptions,
    setCategoryManagerOptions,
    setNoteFilterManagerOptions,
    setSelectedView,
    setSettingManagerOptions,
    setTaskFilterManagerOptions,
    setTaskTemplateManagerOptions,
    synchronize
} from 'actions/AppActions';
import {
    backupData,
    cleanBackups
} from 'actions/BackupActions';
import { setSelectedNoteIds, setSelectedNoteFilter } from 'actions/NoteActions';
import { setSelectedTaskIds, setSelectedTaskFilter } from 'actions/TaskActions';
import { updateSettings } from 'actions/SettingActions';
import { clearProcesses, setProcessesVisible } from 'actions/ProcessActions';
import { isValidLicense } from 'utils/LicenseUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withApp(Component) {
    const mapStateToProps = state => ({
        pro: isValidLicense(state.settings.license),
        selectedView: state.app.selectedView,
        selectedNoteIds: state.notes.selectedNoteIds,
        selectedNoteFilter: state.notes.selectedNoteFilter,
        selectedTaskIds: state.tasks.selectedTaskIds,
        selectedTaskFilter: state.tasks.selectedTaskFilter,
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