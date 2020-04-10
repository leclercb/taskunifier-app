const { app, dialog, ipcMain, shell, BrowserWindow } = require('electron');
const log = require('electron-log');
const { autoUpdater, CancellationToken } = require('electron-updater');
const os = require('os');

function initializeIpcMainEvents() {
    ipcMain.on('check-for-updates', async event => {
        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = false;
        autoUpdater.logger = log;

        const updateCheckResult = await autoUpdater.checkForUpdates();
        log.info(updateCheckResult);

        event.sender.send('update-check-result', updateCheckResult);
    });

    ipcMain.on('download-update', async event => {
        const downloadProgressHandler = info => {
            event.sender.send('auto-updater-download-progress', info);
        };

        const updateDownloadedHandler = info => {
            event.sender.send('auto-updater-update-downloaded', info);
        };

        try {
            autoUpdater.on('download-progress', downloadProgressHandler);
            autoUpdater.on('update-downloaded', updateDownloadedHandler);

            const cancellationToken = new CancellationToken();
            await autoUpdater.downloadUpdate(cancellationToken);
        } finally {
            autoUpdater.removeListener('download-progress', downloadProgressHandler);
            autoUpdater.removeListener('update-downloaded', updateDownloadedHandler);
        }
    });

    ipcMain.on('quit-and-install', () => {
        autoUpdater.quitAndInstall();
    });

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
        event.sender.send('file-paths-selected', result);
    });

    ipcMain.on('show-save-dialog', async (event, options) => {
        const result = await dialog.showSaveDialog(options);
        event.sender.send('file-paths-selected', result);
    });
}

module.exports = {
    initializeIpcMainEvents
};