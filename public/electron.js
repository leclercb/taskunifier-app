process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const { app, BrowserWindow, Menu, Tray } = require('electron');
const isDevelopment = require('electron-is-dev');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
const path = require('path');

const { initializeIpcMainEvents } = require('./electronIpcMainEvents.js');
const { initializeMenu } = require('./electronMenu.js');

autoUpdater.logger = log;

log.info('Starting TaskUnifier');

const settings = getCoreSettings();
let quitStarted = false;

initializeIpcMainEvents();
initializeMenu();

app.on('ready', () => {
    createMainWindow(settings);

    if (settings.useTray) {
        createTray();
    }

    app.setAsDefaultProtocolClient('tu');
    app.setAsDefaultProtocolClient('taskunifier');

    autoUpdater.checkForUpdatesAndNotify();
});

app.on('before-quit', () => {
    let window = getDefaultWindow();

    if (window && !quitStarted) {
        quitStarted = true;

        event.preventDefault();
        window.webContents.send('before-quit');
    }
});

app.on('window-all-closed', () => {
    if (!settings.useTray) {
        app.quit();
    }
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
        icon: 'public/resources/images/logo.png',
        skipTaskbar: settings.useTray,
        webPreferences: {
            nodeIntegration: true
        }
    }, getWindowSettings(settings)));

    if (isDevelopment) {
        const {
            default: installExtension,
            REACT_DEVELOPER_TOOLS,
            REDUX_DEVTOOLS
        } = require('electron-devtools-installer');

        installExtension(REACT_DEVELOPER_TOOLS)
            .then(name => { log.info(`Added Extension: ${name}`); })
            .catch(error => { log.error('An error occurred: ', error); });

        installExtension(REDUX_DEVTOOLS)
            .then(name => { log.info(`Added Extension: ${name}`); })
            .catch(error => { log.error('An error occurred: ', error); });

        window.webContents.openDevTools();
    }

    if (isDevelopment) {
        window.loadURL('http://localhost:3000');
    } else {
        window.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    }

    window.once('ready-to-show', () => {
        window.show();
    });

    window.on('close', event => {
        if (settings.useTray) {
            event.preventDefault();
            window.hide();
        }
    });

    window.webContents.on('devtools-opened', () => {
        window.focus();
    });

    return window;
}

function createTray() {
    const tray = new Tray('public/resources/images/logo.png');

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ]);

    tray.setToolTip('TaskUnifier');
    tray.setContextMenu(contextMenu);
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