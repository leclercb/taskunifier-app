import { connect } from 'react-redux';
import {
    loadData,
    saveData,
    setBatchAddTasksManagerOptions,
    setBatchEditTasksManagerOptions,
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
import withBusyCheck from 'containers/WithBusyCheck';
import {
    getBatchAddTasksManager,
    getBatchEditTasksManager,
    getCategoryManager,
    getNoteFilterManager,
    getSelectedView,
    getSettingManager,
    getTaskEditionManager,
    getTaskFilterManager,
    getTaskTemplateManager,
    isValidLicense
} from 'selectors/AppSelectors';

function withApp(Component) {
    const mapStateToProps = state => ({
        pro: isValidLicense(state),
        selectedView: getSelectedView(state),
        batchAddTasksManager: getBatchAddTasksManager(state),
        batchEditTasksManager: getBatchEditTasksManager(state),
        categoryManager: getCategoryManager(state),
        noteFilterManager: getNoteFilterManager(state),
        taskFilterManager: getTaskFilterManager(state),
        taskEditionManager: getTaskEditionManager(state),
        taskTemplateManager: getTaskTemplateManager(state),
        settingManager: getSettingManager(state)
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
        setNoteFilterManagerOptions: options => dispatch(setNoteFilterManagerOptions(options)),
        setTaskFilterManagerOptions: options => dispatch(setTaskFilterManagerOptions(options)),
        setTaskEditionManagerOptions: options => dispatch(setTaskEditionManagerOptions(options)),
        setTaskTemplateManagerOptions: options => dispatch(setTaskTemplateManagerOptions(options)),
        setSettingManagerOptions: options => dispatch(setSettingManagerOptions(options))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withApp;