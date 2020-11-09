const { app, ipcMain, BrowserWindow } = require('electron');
const log = require('electron-log');

function initializeIpc(setQuitInitiated) {
    ipcMain.on('initiate-quit', () => {
        setQuitInitiated(true);
    });

    ipcMain.on('current-window-get-position', (event, args) => {
        log.info('current-window-get-position: ' + JSON.stringify(args));
        const window = BrowserWindow.fromId(args[0]);
        event.returnValue = window ? window.getPosition() : null;
    });

    ipcMain.on('current-window-get-size', (event, args) => {
        log.info('current-window-get-size: ' + JSON.stringify(args));
        const window = BrowserWindow.fromId(args[0]);
        event.returnValue = window ? window.getSize() : null;
    });

    ipcMain.on('current-window-close', (event, args) => {
        log.info('current-window-close: ' + JSON.stringify(args));
        const window = BrowserWindow.fromId(args[0]);

        if (window) {
            window.close();
        }
    });

    ipcMain.on('process-get-env', event => {
        event.returnValue = process.env;
    });

    ipcMain.on('set-badge-count', (event, args) => {
        app.setBadgeCount(args[0]);
    });
}

module.exports = {
    initializeIpc
};