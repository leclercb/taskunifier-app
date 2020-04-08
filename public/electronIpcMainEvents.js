const { app, dialog, ipcMain, shell, BrowserWindow } = require('electron');
const os = require('os');

function initializeIpcMainEvents() {
    ipcMain.on('close-window', () => {
        BrowserWindow.getFocusedWindow().close();
    });

    ipcMain.on('get-current-window-position', event => {
        event.returnValue = BrowserWindow.getFocusedWindow().getPosition();
    });

    ipcMain.on('get-current-window-size', event => {
        event.returnValue = BrowserWindow.getFocusedWindow().getSize();
    });

    ipcMain.on('get-os-platform', event => {
        event.returnValue = os.platform();
    });

    ipcMain.on('get-version', event => {
        event.returnValue = app.getVersion();
    });

    ipcMain.on('open-external', (event, url) => {
        shell.openExternal(url);
    });

    ipcMain.on('open-file', (event, file) => {
        shell.openItem(file);
    });

    ipcMain.on('pdf-viewer', (event, file) => {
        shell.openItem(file);
    });

    ipcMain.on('set-badge-count', (event, count) => {
        app.setBadgeCount(count);
    });

    ipcMain.on('show-open-dialog', async (event, options) => {
        const result = await dialog.showOpenDialog(options);
        BrowserWindow.getFocusedWindow().webContents.send('file-paths-selected', result);
    });

    ipcMain.on('show-save-dialog', async (event, options) => {
        const result = await dialog.showSaveDialog(options);
        BrowserWindow.getFocusedWindow().webContents.send('file-paths-selected', result);
    });
}

module.exports = {
    initializeIpcMainEvents
};