const { app, shell, BrowserWindow, Menu } = require('electron');

function initializeMenu() {
    const isMac = process.platform === 'darwin';

    const template = [
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: 'File',
            submenu: [
                {
                    label: 'Save',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-save');
                    }
                },
                {
                    label: 'Backup',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-backup');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Import Data',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-import-data');
                    }
                },
                {
                    label: 'Export Data',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-export-data');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Settings',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-settings');
                    }
                },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Z' : 'Ctrl+Z',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-undo');
                    }
                },
                {
                    label: 'Redo',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Y' : 'Ctrl+Y',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-redo');
                    }
                },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' }
            ]
        },
        {
            label: 'Notes',
            submenu: [
                {
                    label: 'Add Note',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Alt+N' : 'Ctrl+Shift+N',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-add-note');
                    }
                },
                {
                    label: 'Remove Note(s)',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-remove-notes');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Print Notes',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-print-notes');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Note Filter Manager',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-note-filter-manager');
                    }
                },
                {
                    label: 'Note Field Manager',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-note-field-manager');
                    }
                }
            ]
        },
        {
            label: 'Tasks',
            submenu: [
                {
                    label: 'Add Task',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Alt+T' : 'Ctrl+Shift+T',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-add-task');
                    }
                },
                {
                    label: 'Add Sub-Task',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Alt+Y' : 'Ctrl+Shift+Y',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-add-sub-task');
                    }
                },
                {
                    label: 'Batch Add Tasks',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Alt+B' : 'Ctrl+Shift+B',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-batch-add-tasks');
                    }
                },
                {
                    label: 'Edit Task(s)',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Alt+E' : 'Ctrl+Shift+E',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-edit-tasks');
                    }
                },
                {
                    label: 'Remove Task(s)',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-remove-tasks');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Print Tasks',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-print-tasks');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Task Filter Manager',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-task-filter-manager');
                    }
                },
                {
                    label: 'Task Template Manager',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-task-template-manager');
                    }
                },
                {
                    label: 'Task Field Manager',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-task-field-manager');
                    }
                }
            ]
        },
        {
            label: 'Synchronization',
            submenu: [
                {
                    label: 'Synchronize',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-synchronize');
                    }
                }
            ]
        },
        {
            label: 'Publication',
            submenu: [
                {
                    label: 'Publish',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-publish');
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    label: 'Category Manager',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-category-manager');
                    }
                },
                {
                    label: 'Reminder Manager',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-reminder-manager');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Show Tasks',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-show-tasks');
                    }
                },
                {
                    label: 'Show Calendar',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-show-calendar');
                    }
                },
                {
                    label: 'Show Notes',
                    click: async () => {
                        BrowserWindow.getFocusedWindow().webContents.send('menu-show-notes');
                    }
                },
                { type: 'separator' },
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ?
                    [
                        { type: 'separator' },
                        { role: 'front' },
                        { type: 'separator' },
                        { role: 'window' }
                    ] :
                    [
                        { role: 'close' }
                    ]
                )
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://www.taskunifier.app');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

module.exports = {
    initializeMenu
};