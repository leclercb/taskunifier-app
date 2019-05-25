import { connect } from 'react-redux';
import {
    loadData,
    saveData,
    setBatchAddTasksManagerOptions,
    setBatchEditTasksManagerOptions,
    setCategoryManagerOptions,
    setNoteFilterManagerOptions,
    setReminderManagerOptions,
    setSettingManagerOptions,
    setSynchronizationManagerOptions,
    setTaskEditionManagerOptions,
    setTaskFieldManagerOptions,
    setTaskFilterManagerOptions,
    setTaskTemplateManagerOptions,
    synchronize
} from 'actions/AppActions';
import {
    backupData,
    cleanBackups
} from 'actions/BackupActions';
import { setSelectedView } from 'actions/SettingActions';
import withBusyCheck from 'containers/WithBusyCheck';
import {
    getBatchAddTasksManager,
    getBatchEditTasksManager,
    getCategoryManager,
    getNoteFilterManager,
    getReminderManager,
    getSettingManager,
    getSynchronizationManager,
    getTaskEditionManager,
    getTaskFieldManager,
    getTaskFilterManager,
    getTaskTemplateManager,
    isValidLicense
} from 'selectors/AppSelectors';
import { getSelectedView } from 'selectors/SettingSelectors';

function withApp(Component) {
    const mapStateToProps = state => ({
        pro: isValidLicense(state),
        selectedView: getSelectedView(state),
        batchAddTasksManager: getBatchAddTasksManager(state),
        batchEditTasksManager: getBatchEditTasksManager(state),
        categoryManager: getCategoryManager(state),
        reminderManager: getReminderManager(state),
        noteFilterManager: getNoteFilterManager(state),
        taskFieldManager: getTaskFieldManager(state),
        taskFilterManager: getTaskFilterManager(state),
        taskEditionManager: getTaskEditionManager(state),
        taskTemplateManager: getTaskTemplateManager(state),
        settingManager: getSettingManager(state),
        synchronizationManager: getSynchronizationManager(state)
    });

    const mapDispatchToProps = dispatch => ({
        loadData: () => dispatch(loadData()),
        saveData: options => dispatch(saveData(options)),
        backupData: () => dispatch(backupData()),
        cleanBackups: () => dispatch(cleanBackups()),
        synchronize: () => dispatch(synchronize()),
        setSelectedView: view => dispatch(setSelectedView(view)),
        setBatchAddTasksManagerOptions: options => dispatch(setBatchAddTasksManagerOptions(options)),
        setBatchEditTasksManagerOptions: options => dispatch(setBatchEditTasksManagerOptions(options)),
        setCategoryManagerOptions: options => dispatch(setCategoryManagerOptions(options)),
        setReminderManagerOptions: options => dispatch(setReminderManagerOptions(options)),
        setNoteFilterManagerOptions: options => dispatch(setNoteFilterManagerOptions(options)),
        setTaskFieldManagerOptions: options => dispatch(setTaskFieldManagerOptions(options)),
        setTaskFilterManagerOptions: options => dispatch(setTaskFilterManagerOptions(options)),
        setTaskEditionManagerOptions: options => dispatch(setTaskEditionManagerOptions(options)),
        setTaskTemplateManagerOptions: options => dispatch(setTaskTemplateManagerOptions(options)),
        setSettingManagerOptions: options => dispatch(setSettingManagerOptions(options)),
        setSynchronizationManagerOptions: options => dispatch(setSynchronizationManagerOptions(options))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withApp;