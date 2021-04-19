import React from 'react';
import { Modal, message } from 'antd';
import Mousetrap from 'mousetrap';
import { store } from 'store/Store';
import {
    _loadDataFromFile,
    _saveDataToFile,
    saveData,
    setBatchAddTasksManagerOptions,
    setBatchEditTasksManagerOptions,
    setCategoryManagerOptions,
    setEditingCell,
    setNoteFieldManagerOptions,
    setNoteFilterManagerOptions,
    setReminderManagerOptions,
    setSelectedNoteIds,
    setSelectedTaskIds,
    setSettingManagerOptions,
    setTaskEditionManagerOptions,
    setTaskFieldManagerOptions,
    setTaskFilterManagerOptions,
    setTaskTemplateManagerOptions
} from 'actions/AppActions';
import { backupData } from 'actions/BackupActions';
import { addNote, deleteNote, redoNoteStateUpdate, undoNoteStateUpdate } from 'actions/NoteActions';
import { printNotes, printTasks } from 'actions/PrintActions';
import { publish } from 'actions/PublicationActions';
import { setSelectedView } from 'actions/SettingActions';
import { synchronize } from 'actions/SynchronizationActions';
import { addTask, deleteTask, redoTaskStateUpdate, undoTaskStateUpdate } from 'actions/TaskActions';
import FileField from 'components/common/FileField';
import { getSelectedNoteFilter, getSelectedTaskFilter } from 'selectors/AppSelectors';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { canRedoNoteStateUpdate, canUndoNoteStateUpdate, getNotesFilteredBySelectedFilter, getSelectedNoteIds } from 'selectors/NoteSelectors';
import { getSelectedView, getSettings } from 'selectors/SettingSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { canRedoTaskStateUpdate, canUndoTaskStateUpdate, getSelectedTaskIds, getSelectedTasks, getTasksFilteredBySelectedFilter } from 'selectors/TaskSelectors';
import { getDefaultTaskTemplate, getTaskTemplatesFilteredByVisibleState } from 'selectors/TaskTemplateSelectors';
import { lstat } from 'utils/ElectronIpc';
import { applyNoteTemplateFromNoteFilter, applyTaskTemplate, applyTaskTemplateFromTaskFilter } from 'utils/TemplateUtils';

export function initializeShortcuts() {
    if (process.env.REACT_APP_MODE === 'electron') {
        const { ipcRenderer } = window.electron;

        ipcRenderer.on('menu-save', async () => {
            await executeSave();
        });

        ipcRenderer.on('menu-backup', async () => {
            await executeBackup();
        });

        ipcRenderer.on('menu-import-data', async () => {
            await executeImportData();
        });

        ipcRenderer.on('menu-export-data', async () => {
            await executeExportData();
        });

        ipcRenderer.on('menu-settings', async () => {
            await executeSettings();
        });

        ipcRenderer.on('menu-undo', async () => {
            await executeUndo();
        });

        ipcRenderer.on('menu-redo', async () => {
            await executeRedo();
        });

        ipcRenderer.on('menu-add-note', async () => {
            await executeAddNote();
        });

        ipcRenderer.on('menu-remove-notes', async () => {
            await executeRemoveNotes();
        });

        ipcRenderer.on('menu-print-notes', async () => {
            await executePrintNotes();
        });

        ipcRenderer.on('menu-note-filter-manager', async () => {
            await executeNoteFilterManager();
        });

        ipcRenderer.on('menu-note-field-manager', async () => {
            await executeNoteFieldManager();
        });

        ipcRenderer.on('menu-add-task', async () => {
            await executeAddTask();
        });

        ipcRenderer.on('menu-add-sub-task', async () => {
            await executeAddSubTask();
        });

        ipcRenderer.on('menu-batch-add-tasks', async () => {
            await executeBatchAddTasks();
        });

        ipcRenderer.on('menu-edit-tasks', async () => {
            await executeEditTasks();
        });

        ipcRenderer.on('menu-remove-tasks', async () => {
            await executeRemoveTasks();
        });

        ipcRenderer.on('menu-print-tasks', async () => {
            await executePrintTasks();
        });

        ipcRenderer.on('menu-task-filter-manager', async () => {
            await executeTaskFilterManager();
        });

        ipcRenderer.on('menu-task-template-manager', async () => {
            await executeTaskTemplateManager();
        });

        ipcRenderer.on('menu-task-field-manager', async () => {
            await executeTaskFieldManager();
        });

        ipcRenderer.on('menu-synchronize', async () => {
            await executeSynchronize();
        });

        ipcRenderer.on('menu-publish', async () => {
            await executePublish();
        });

        ipcRenderer.on('menu-category-manager', async () => {
            await executeCategoryManager();
        });

        ipcRenderer.on('menu-reminder-manager', async () => {
            await executeReminderManager();
        });

        ipcRenderer.on('menu-show-tasks', async () => {
            await executeShowTasks();
        });

        ipcRenderer.on('menu-show-calendar', async () => {
            await executeShowCalendar();
        });

        ipcRenderer.on('menu-show-notes', async () => {
            await executeShowNotes();
        });
    } else {
        Mousetrap.bind(['command+alt+n', 'ctrl+shift+n'], async () => {
            await executeAddNote();
            return false;
        });

        Mousetrap.bind(['command+alt+t', 'ctrl+shift+t'], async () => {
            await executeAddTask();
            return false;
        });

        Mousetrap.bind(['command+alt+y', 'ctrl+shift+y'], async () => {
            await executeAddSubTask();
            return false;
        });

        Mousetrap.bind(['command+alt+b', 'ctrl+shift+b'], async () => {
            await executeBatchAddTasks();
            return false;
        });

        Mousetrap.bind(['command+alt+e', 'ctrl+shift+e'], async () => {
            await executeEditTasks();
            return false;
        });
    }
}

async function executeSave() {
    await store.dispatch(saveData());
}

async function executeBackup() {
    await store.dispatch(backupData());
}

async function executeImportData() {
    let file = null;

    Modal.confirm({
        title: 'Import data',
        content: (
            <FileField
                onChange={value => file = value}
                options={{
                    filters: [
                        {
                            name: 'Zip Files',
                            extensions: ['zip']
                        }
                    ],
                    properties: [
                        'openFile'
                    ]
                }}
                style={{
                    width: 400,
                    marginBottom: 10
                }} />
        ),
        okText: 'Import',
        onOk: async () => {
            if (file) {
                const fileStat = await lstat(file);

                if (!fileStat.isFile()) {
                    message.error('Please select a zip file');
                    return;
                }

                await store.dispatch(backupData());
                await store.dispatch(_loadDataFromFile(file, { zip: true }));
            } else {
                message.error('Please select a zip file');
            }
        },
        width: 500
    });
}

async function executeExportData() {
    let file = null;

    Modal.confirm({
        title: 'Export data',
        content: (
            <FileField
                onChange={value => file = value}
                type="save"
                options={{
                    filters: [
                        {
                            name: 'Zip Files',
                            extensions: ['zip']
                        }
                    ]
                }}
                style={{
                    width: 400,
                    marginBottom: 10
                }} />
        ),
        okText: 'Export',
        onOk: async () => {
            if (file) {
                await store.dispatch(_saveDataToFile(file, { zip: true }));
            } else {
                message.error('Please select a zip file');
            }
        },
        width: 500
    });
}

async function executeSettings() {
    await store.dispatch(setSettingManagerOptions({ visible: true }));
}

async function executeUndo() {
    const state = store.getState();
    const selectedView = getSelectedView(state);

    switch (selectedView) {
        case 'note':
            if (canUndoNoteStateUpdate(state)) {
                await store.dispatch(undoNoteStateUpdate());
                message.success('Undo action');
            } else {
                message.warning('Nothing to undo');
            }
            break;
        case 'task':
        case 'taskCalendar':
            if (canUndoTaskStateUpdate(state)) {
                await store.dispatch(undoTaskStateUpdate());
                message.success('Undo action');
            } else {
                message.warning('Nothing to undo');
            }
            break;
        default:
            break;
    }
}

async function executeRedo() {
    const state = store.getState();
    const selectedView = getSelectedView(state);

    switch (selectedView) {
        case 'note':
            if (canRedoNoteStateUpdate(state)) {
                await store.dispatch(redoNoteStateUpdate());
                message.success('Redo action');
            } else {
                message.warning('Nothing to redo');
            }
            break;
        case 'task':
        case 'taskCalendar':
            if (canRedoTaskStateUpdate(state)) {
                await store.dispatch(redoTaskStateUpdate());
                message.success('Redo action');
            } else {
                message.warning('Nothing to redo');
            }
            break;
        default:
            break;
    }
}

export async function executeAddNote(callback = null) {
    const state = store.getState();

    await store.dispatch(setSelectedView('note'));

    let note = {};

    applyNoteTemplateFromNoteFilter(getSelectedNoteFilter(state), note, getNoteFieldsIncludingDefaults(state));

    if (callback) {
        callback(note);
    }

    note = await store.dispatch(addNote(note));
    await store.dispatch(setSelectedNoteIds(note.id));
    await store.dispatch(setEditingCell(note.id, 'title'));
}

async function executeRemoveNotes() {
    await store.dispatch(deleteNote(getSelectedNoteIds(store.getState())));
}

async function executePrintNotes() {
    await store.dispatch(printNotes(getNotesFilteredBySelectedFilter(store.getState())));
}

async function executeNoteFilterManager() {
    await store.dispatch(setNoteFilterManagerOptions({ visible: true }));
}

async function executeNoteFieldManager() {
    await store.dispatch(setNoteFieldManagerOptions({ visible: true }));
}

export async function executeAddTask(callback = null) {
    const state = store.getState();

    await store.dispatch(setSelectedView('task'));

    let task = {};

    applyTaskTemplate(getDefaultTaskTemplate(state), task, getTaskFieldsIncludingDefaults(state));
    applyTaskTemplateFromTaskFilter(getSelectedTaskFilter(state), getTaskTemplatesFilteredByVisibleState(state), task, getTaskFieldsIncludingDefaults(state));

    if (callback) {
        callback(task);
    }

    task = await store.dispatch(addTask(task));
    await store.dispatch(setSelectedTaskIds(task.id));

    if (getSettings(state).openTaskEditionManagerWhenTaskAdded) {
        await store.dispatch(setTaskEditionManagerOptions({
            visible: true,
            taskId: task.id
        }));
    } else {
        await store.dispatch(setEditingCell(task.id, 'title'));
    }
}

async function executeAddSubTask() {
    const selectedTasks = getSelectedTasks(store.getState());

    if (selectedTasks.length === 1) {
        await executeAddTask(task => {
            task.parent = selectedTasks[0].id;
            task.context = selectedTasks[0].context;
            task.folder = selectedTasks[0].folder;
            task.goal = selectedTasks[0].goal;
            task.location = selectedTasks[0].location;
        });
    } else {
        message.error('Please select one task');
    }
}

async function executeBatchAddTasks() {
    await store.dispatch(setBatchAddTasksManagerOptions({ visible: true }));
}

async function executeEditTasks() {
    const selectedTaskIds = getSelectedTaskIds(store.getState());

    if (selectedTaskIds.length === 1) {
        await store.dispatch(setTaskEditionManagerOptions({
            visible: true,
            taskId: selectedTaskIds[0]
        }));
    } else if (selectedTaskIds.length > 1 && selectedTaskIds.length <= 50) {
        await store.dispatch(setBatchEditTasksManagerOptions({ visible: true }));
    } else {
        message.error('Please select one or more tasks (maximum 50)');
    }
}

async function executeRemoveTasks() {
    await store.dispatch(deleteTask(getSelectedTaskIds(store.getState())));
}

async function executePrintTasks() {
    await store.dispatch(printTasks(getTasksFilteredBySelectedFilter(store.getState())));
}

async function executeTaskFilterManager() {
    await store.dispatch(setTaskFilterManagerOptions({ visible: true }));
}

async function executeTaskTemplateManager() {
    await store.dispatch(setTaskTemplateManagerOptions({ visible: true }));
}

async function executeTaskFieldManager() {
    await store.dispatch(setTaskFieldManagerOptions({ visible: true }));
}

async function executeSynchronize() {
    await store.dispatch(synchronize());
}

async function executePublish() {
    await store.dispatch(publish());
}

async function executeCategoryManager() {
    await store.dispatch(setCategoryManagerOptions({ visible: true }));
}

async function executeReminderManager() {
    await store.dispatch(setReminderManagerOptions({ visible: true }));
}

async function executeShowTasks() {
    await store.dispatch(setSelectedView('task'));
}

async function executeShowCalendar() {
    await store.dispatch(setSelectedView('taskCalendar'));
}

async function executeShowNotes() {
    await store.dispatch(setSelectedView('note'));
}