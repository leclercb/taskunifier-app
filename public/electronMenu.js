const { app, BrowserWindow, Menu } = require('electron')

const isMac = process.platform === 'darwin'

const template = [
    // { role: 'appMenu' }
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
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac ?
                [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startspeaking' },
                            { role: 'stopspeaking' }
                        ]
                    }
                ] :
                [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ]
            )
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
            }
        ]
    },
    // { role: 'viewMenu' }
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
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
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
                    const { shell } = require('electron')
                    await shell.openExternal('https://www.taskunifier.app')
                }
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);