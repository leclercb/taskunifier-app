// https://medium.com/@brockhoff/using-electron-with-react-the-basics-e93f9761f86f
const { app, ipcMain, BrowserWindow } = require('electron');

function createWindow() {
    win = new BrowserWindow({
        show: false,
        width: 1024,
        height: 768,
        icon: 'public/resources/images/logo.png'
    });

    win.loadURL('http://localhost:3000');

    win.once('ready-to-show', () => {
        win.show();
    });

    win.on('close', (e) => {
        if (win) {
            e.preventDefault();
            win.webContents.send('app-close');
        }
    });

    ipcMain.on('closed', _ => {
        win = null;

        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    ipcMain.on('resize', (event, arg) => {
        win.setSize(arg.width, arg.height);
    });
}

app.on('ready', createWindow);