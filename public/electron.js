process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const { app, BrowserWindow, Tray } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDevelopment = require('electron-is-dev');
const log = require('electron-log');
const fs = require('fs');
const path = require('path');

const { initializeMenu } = require('./electronMenu.js');

log.info('Starting TaskUnifier');

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;
autoUpdater.logger = log;

const isMac = process.platform === 'darwin';
const settings = getCoreSettings();

// eslint-disable-next-line no-unused-vars
let tray = null; // To avoid being garbage collected
let quitInitiated = false;

initializeMenu();

app.on('ready', () => {
    createMainWindow(settings);

    if (settings.useTray) {
        tray = createTray();
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

function getCoreSettings() {
    const userDataPath = app.getPath('userData');
    const data = fs.readFileSync(path.join(userDataPath, 'coreSettings.json'), 'utf-8');
    return JSON.parse(data);
}

function getDefaultWindow() {
    if (BrowserWindow.getFocusedWindow()) {
        return BrowserWindow.getFocusedWindow();
    }

    if (BrowserWindow.getAllWindows().length > 0) {
        return BrowserWindow.getAllWindows()[0];
    }

    return null;
}

function createMainWindow(settings) {
    const window = new BrowserWindow(Object.assign({
        show: false,
        icon: path.join(__dirname, 'resources', 'images', 'logo.png'),
        skipTaskbar: settings.useTray,
        webPreferences: {
            nodeIntegration: true
        }
    }, getWindowSettings(settings)));

    let closed = false;

    if (isDevelopment) {
        const {
            default: installExtension,
            REACT_DEVELOPER_TOOLS,
            REDUX_DEVTOOLS
        } = require('electron-devtools-installer');

        installExtension(REACT_DEVELOPER_TOOLS)
            .then(name => { log.info(`Added extension: ${name}`); })
            .catch(error => { log.error('An error occurred: ', error); });

        installExtension(REDUX_DEVTOOLS)
            .then(name => { log.info(`Added extension: ${name}`); })
            .catch(error => { log.error('An error occurred: ', error); });

        window.webContents.openDevTools();
    }

    if (isDevelopment) {
        window.loadURL('http://localhost:3000');
    } else {
        window.loadURL(`file://${path.join(__dirname, 'index.html')}`);
    }

    window.once('ready-to-show', () => {
        window.show();
    });

    window.on('show', () => {
        if (settings.useTray && isMac) {
            app.dock.show();
        }
    });

    window.on('hide', () => {
        if (settings.useTray && isMac) {
            app.dock.hide();
        }
    });

    window.on('session-end', () => {
        log.info('Session end');

        if (!closed) {
            closed = true;
            window.show();
            window.webContents.send('window-close');
        }
    });

    window.on('close', event => {
        if (settings.useTray && !quitInitiated) {
            event.preventDefault();
            window.hide();
            return;
        }

        if (!closed) {
            event.preventDefault();
            closed = true;
            window.show();
            window.webContents.send('window-close');
            return;
        }
    });

    window.webContents.on('devtools-opened', () => {
        window.focus();
    });

    return window;
}

function createTray() {
    const tray = new Tray(path.join(__dirname, 'resources', 'icons', 'logo.png'));
    tray.setToolTip('TaskUnifier');

    tray.on('click', () => {
        getDefaultWindow().show();
    });

    return tray;
}

function getWindowSettings(settings) {
    try {
        const window = {
            width: 1280,
            height: 768
        };

        if (Number.isInteger(settings.windowSizeWidth) &&
            Number.isInteger(settings.windowSizeHeight)) {
            window.width = settings.windowSizeWidth;
            window.height = settings.windowSizeHeight;
        }

        if (Number.isInteger(settings.windowPositionX) &&
            Number.isInteger(settings.windowPositionY)) {
            window.x = settings.windowPositionX;
            window.y = settings.windowPositionY;
        }

        return window;
    } catch (error) {
        return {
            width: 1280,
            height: 768
        };
    }
}