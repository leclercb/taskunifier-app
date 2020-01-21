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
import { addNote, deleteNote } from 'actions/NoteActions';
import { printNotes, printTasks } from 'actions/PrintActions';
import { setSelectedView } from 'actions/SettingActions';
import { synchronize } from 'actions/SynchronizationActions';
import { addTask, deleteTask } from 'actions/TaskActions';
import FileField from 'components/common/FileField';
import { getSelectedNoteIds, getSelectedTaskFilter, getSelectedTaskIds } from 'selectors/AppSelectors';
import { getNotesFilteredByVisibleState } from 'selectors/NoteSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { getDefaultTaskTemplate, getTaskTemplatesFilteredByVisibleState } from 'selectors/TaskTemplateSelectors';
import { lstat } from 'utils/ElectronUtils';
import { applyTaskTemplate, applyTaskTemplateFromTaskFilter } from 'utils/TaskTemplateUtils';

export function initializeShortcuts() {
    if (process.env.REACT_APP_MODE === 'electron') {
        const { ipcRenderer } = window.require('electron');

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

async function executeAddNote() {
    await store.dispatch(setSelectedView('note'));
    const note = await store.dispatch(addNote());
    await store.dispatch(setSelectedNoteIds(note.id));
    await store.dispatch(setEditingCell(note.id, 'title'));
}

async function executeRemoveNotes() {
    await store.dispatch(deleteNote(getSelectedNoteIds(store.getState())));
}

async function executePrintNotes() {
    await store.dispatch(printNotes(getNotesFilteredByVisibleState(store.getState())));
}

async function executeNoteFilterManager() {
    await store.dispatch(setNoteFilterManagerOptions({ visible: true }));
}

async function executeNoteFieldManager() {
    await store.dispatch(setNoteFieldManagerOptions({ visible: true }));
}

async function executeAddTask() {
    const state = store.getState();

    await store.dispatch(setSelectedView('task'));

    let task = {};

    applyTaskTemplate(getDefaultTaskTemplate(state), task, getTaskFieldsIncludingDefaults(state));
    applyTaskTemplateFromTaskFilter(getSelectedTaskFilter(state), getTaskTemplatesFilteredByVisibleState(state), task, getTaskFieldsIncludingDefaults(state));

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
    await store.dispatch(printTasks(getTasksFilteredByVisibleState(store.getState())));
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