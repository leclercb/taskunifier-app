import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    loadData,
    saveData,
    setBatchAddTasksManagerOptions,
    setBatchEditTasksManagerOptions,
    setCategoryManagerOptions,
    setEditingCell,
    setNoteFieldManagerOptions,
    setNoteFilterManagerOptions,
    setReminderManagerOptions,
    setSettingManagerOptions,
    setTaskEditionManagerOptions,
    setTaskFieldManagerOptions,
    setTaskFilterManagerOptions,
    setTaskTemplateManagerOptions
} from 'actions/AppActions';
import {
    backupData,
    cleanBackups
} from 'actions/BackupActions';
import { setSelectedView } from 'actions/SettingActions';
import { synchronize } from 'actions/SynchronizationActions';
import {
    getBatchAddTasksManager,
    getBatchEditTasksManager,
    getCategoryManager,
    getEditingCell,
    getNoteFieldManager,
    getNoteFilterManager,
    getReminderManager,
    getSettingManager,
    getTaskEditionManager,
    getTaskFieldManager,
    getTaskFilterManager,
    getTaskTemplateManager,
    isPro
} from 'selectors/AppSelectors';
import { getSelectedView } from 'selectors/SettingSelectors';

export function useAppApi() {
    const dispatch = useDispatch();

    const pro = useSelector(isPro);
    const selectedView = useSelector(getSelectedView);
    const editingCell = useSelector(getEditingCell);
    const batchAddTasksManager = useSelector(getBatchAddTasksManager);
    const batchEditTasksManager = useSelector(getBatchEditTasksManager);
    const categoryManager = useSelector(getCategoryManager);
    const reminderManager = useSelector(getReminderManager);
    const noteFieldManager = useSelector(getNoteFieldManager);
    const noteFilterManager = useSelector(getNoteFilterManager);
    const taskFieldManager = useSelector(getTaskFieldManager);
    const taskFilterManager = useSelector(getTaskFilterManager);
    const taskEditionManager = useSelector(getTaskEditionManager);
    const taskTemplateManager = useSelector(getTaskTemplateManager);
    const settingManager = useSelector(getSettingManager);

    const loadDataCallback = useCallback(
        () => dispatch(loadData()),
        [dispatch]
    );

    const saveDataCallback = useCallback(
        options => dispatch(saveData(options)),
        [dispatch]
    );

    const backupDataCallback = useCallback(
        () => dispatch(backupData()),
        [dispatch]
    );

    const cleanBackupsCallback = useCallback(
        () => dispatch(cleanBackups()),
        [dispatch]
    );

    const synchronizeCallback = useCallback(
        () => dispatch(synchronize()),
        [dispatch]
    );

    const setSelectedViewCallback = useCallback(
        view => dispatch(setSelectedView(view)),
        [dispatch]
    );

    const setEditingCellCallback = useCallback(
        (objectId, fieldId) => dispatch(setEditingCell(objectId, fieldId)),
        [dispatch]
    );

    const setBatchAddTasksManagerOptionsCallback = useCallback(
        options => dispatch(setBatchAddTasksManagerOptions(options)),
        [dispatch]
    );

    const setBatchEditTasksManagerOptionsCallback = useCallback(
        options => dispatch(setBatchEditTasksManagerOptions(options)),
        [dispatch]
    );

    const setCategoryManagerOptionsCallback = useCallback(
        options => dispatch(setCategoryManagerOptions(options)),
        [dispatch]
    );

    const setReminderManagerOptionsCallback = useCallback(
        options => dispatch(setReminderManagerOptions(options)),
        [dispatch]
    );

    const setNoteFieldManagerOptionsCallback = useCallback(
        options => dispatch(setNoteFieldManagerOptions(options)),
        [dispatch]
    );

    const setNoteFilterManagerOptionsCallback = useCallback(
        options => dispatch(setNoteFilterManagerOptions(options)),
        [dispatch]
    );

    const setTaskFieldManagerOptionsCallback = useCallback(
        options => dispatch(setTaskFieldManagerOptions(options)),
        [dispatch]
    );

    const setTaskFilterManagerOptionsCallback = useCallback(
        options => dispatch(setTaskFilterManagerOptions(options)),
        [dispatch]
    );

    const setTaskEditionManagerOptionsCallback = useCallback(
        options => dispatch(setTaskEditionManagerOptions(options)),
        [dispatch]
    );

    const setTaskTemplateManagerOptionsCallback = useCallback(
        options => dispatch(setTaskTemplateManagerOptions(options)),
        [dispatch]
    );

    const setSettingManagerOptionsCallback = useCallback(
        options => dispatch(setSettingManagerOptions(options)),
        [dispatch]
    );

    return {
        pro,
        selectedView,
        editingCell,
        batchAddTasksManager,
        batchEditTasksManager,
        categoryManager,
        reminderManager,
        noteFieldManager,
        noteFilterManager,
        taskFieldManager,
        taskFilterManager,
        taskEditionManager,
        taskTemplateManager,
        settingManager,
        loadData: loadDataCallback,
        saveData: saveDataCallback,
        backupData: backupDataCallback,
        cleanBackups: cleanBackupsCallback,
        synchronize: synchronizeCallback,
        setSelectedView: setSelectedViewCallback,
        setEditingCell: setEditingCellCallback,
        setBatchAddTasksManagerOptions: setBatchAddTasksManagerOptionsCallback,
        setBatchEditTasksManagerOptions: setBatchEditTasksManagerOptionsCallback,
        setCategoryManagerOptions: setCategoryManagerOptionsCallback,
        setReminderManagerOptions: setReminderManagerOptionsCallback,
        setNoteFieldManagerOptions: setNoteFieldManagerOptionsCallback,
        setNoteFilterManagerOptions: setNoteFilterManagerOptionsCallback,
        setTaskFieldManagerOptions: setTaskFieldManagerOptionsCallback,
        setTaskFilterManagerOptions: setTaskFilterManagerOptionsCallback,
        setTaskEditionManagerOptions: setTaskEditionManagerOptionsCallback,
        setTaskTemplateManagerOptions: setTaskTemplateManagerOptionsCallback,
        setSettingManagerOptions: setSettingManagerOptionsCallback
    };
}