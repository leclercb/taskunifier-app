const { app, BrowserWindow, Tray } = require('electron');
const isDevelopment = require('electron-is-dev');
const log = require('electron-log');
const fs = require('fs');
const path = require('path');

const isMac = process.platform === 'darwin';

function createMainWindow(settings, isQuitInitiated) {
    const window = new BrowserWindow(Object.assign({
        show: false,
        icon: path.join(__dirname, 'resources', 'images', 'logo.png'),
        skipTaskbar: settings.useTray,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
            preload: path.join(__dirname, 'electronPreload.js')
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
        if (settings.useTray && !isQuitInitiated()) {
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

function getCoreSettings() {
    try {
        const userDataPath = app.getPath('userData');
        const file = path.join(userDataPath, 'coreSettings.json');

        if (!fs.existsSync(file)) {
            return {};
        }

        const data = fs.readFileSync(file, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
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

function getWindowSettings(settings) {
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
}

module.exports = {
    createMainWindow,
    createTray,
    getCoreSettings,
    getDefaultWindow,
    getWindowSettings
};