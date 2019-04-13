const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');

const isDevelopment = require('electron-is-dev');

let mainWindow = null;

function createMainWindow() {
    const window = new BrowserWindow({
        show: false,
        width: 1024,
        height: 768,
        icon: 'public/resources/images/logo.png'
    });

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

    window.on('close', e => {
        if (mainWindow) {
            e.preventDefault();
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

ipcMain.on('resize', (event, arg) => {
    mainWindow.setSize(arg.width, arg.height);
});

ipcMain.on('move', (event, arg) => {
    mainWindow.setPosition(arg.x, arg.y);
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