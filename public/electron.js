process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const { app, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const { initializeMenu } = require('./electronMenu.js');
const { createMainWindow, createTray, getCoreSettings, getDefaultWindow } = require('./electronUtils.js');

const settings = getCoreSettings();
log.transports.file.level = settings.electronLoggerLevel || 'info';

log.info('Starting TaskUnifier');

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;
autoUpdater.logger = log;

// eslint-disable-next-line no-unused-vars
let tray = null; // To avoid being garbage collected
let quitInitiated = false;

initializeMenu();

app.on('ready', () => {
    createMainWindow(settings, () => quitInitiated);

    if (settings.useTray) {
        tray = createTray(); // eslint-disable-line no-unused-vars
    }

    app.setAsDefaultProtocolClient('tu');
    app.setAsDefaultProtocolClient('taskunifier');
});

app.on('before-quit', () => {
    quitInitiated = true;
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('open-url', (event, url) => {
    event.preventDefault();
    log.info('Open URL', url);

    let window = getDefaultWindow();

    if (window) {
        window.webContents.send('open-url', url);
    }
});

ipcMain.on('initiate-quit', () => {
    quitInitiated = true;
});