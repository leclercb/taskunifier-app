const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow = null;

function createMainWindow() {
    const window = new BrowserWindow({
        show: false,
        width: 1024,
        height: 768,
        icon: 'public/resources/images/logo.png'
    });

    if (isDevelopment) {
        window.webContents.openDevTools();
    }

    if (isDevelopment) {
        window.loadURL('http://localhost:3000');
    } else {
        window.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        }));
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

    window.on('closed', () => {
        mainWindow = null;
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