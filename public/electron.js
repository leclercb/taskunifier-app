process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const { app, dialog, ipcMain, shell, BrowserWindow } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isDevelopment = require('electron-is-dev');

require('./electronMenu.js');

let mainWindow = null;

function getWindowSettings() {
    try {
        const userDataPath = app.getPath('userData');
        const data = fs.readFileSync(path.join(userDataPath, 'coreSettings.json'), 'utf-8');
        const settings = JSON.parse(data);

        const window = {
            width: 1024,
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
    } catch (err) {
        return {
            width: 1024,
            height: 768
        };
    }
}

function createMainWindow() {
    const window = new BrowserWindow(Object.assign({
        show: false,
        icon: 'public/resources/images/logo.png',
        webPreferences: {
            nodeIntegration: true
        }
    }, getWindowSettings()));

    if (isDevelopment) {
        const {
            default: installExtension,
            REACT_DEVELOPER_TOOLS,
            REDUX_DEVTOOLS,
        } = require('electron-devtools-installer');

        installExtension(REACT_DEVELOPER_TOOLS)
            .then(name => { console.log(`Added Extension: ${name}`); })
            .catch(err => { console.log('An error occurred: ', err); });

        installExtension(REDUX_DEVTOOLS)
            .then(name => { console.log(`Added Extension: ${name}`); })
            .catch(err => { console.log('An error occurred: ', err); });

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
        if (mainWindow) {
            event.preventDefault();
            mainWindow.webContents.send('app-close');
        }
    });

    window.webContents.on('devtools-opened', () => {
        window.focus()
        setImmediate(() => {
            window.focus();
        });
    });

    return window;
}

ipcMain.on('get-current-window-size', event => {
    event.returnValue = mainWindow.getSize();
});

ipcMain.on('get-current-window-position', event => {
    event.returnValue = mainWindow.getPosition();
});

ipcMain.on('get-os-platform', event => {
    event.returnValue = os.platform();
});

ipcMain.on('get-version', event => {
    event.returnValue = app.getVersion();
});

ipcMain.on('show-open-dialog', async (event, options) => {
    const filePaths = await dialog.showOpenDialog(options);
    mainWindow.webContents.send('file-paths-selected', filePaths);
});

ipcMain.on('open-file', (event, file) => {
    shell.openItem(file);
});

ipcMain.on('open-external', (event, url) => {
    shell.openExternal(url);
});

ipcMain.on('pdf-viewer', (event, file) => {
    /*
    const pdfViewer = new BrowserWindow({
        title: 'TaskUnifer 2 - PDF Viewer',
        icon: 'public/resources/images/logo.png',
        width: 800,
        height: 600,
        webPreferences: {
            plugins: true
        }
    });

    pdfViewer.loadURL(`file:///${file}`);
    */

    shell.openItem(file);
});

ipcMain.on('closed', () => {
    mainWindow = null;
    app.quit();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', () => {
    mainWindow = createMainWindow();
});