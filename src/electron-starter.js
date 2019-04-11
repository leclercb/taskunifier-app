// https://medium.com/@brockhoff/using-electron-with-react-the-basics-e93f9761f86f
const { app, BrowserWindow } = require('electron');

function createWindow() {
    win = new BrowserWindow({
        show: false,
        width: 1600,
        height: 800,
        icon: 'public/resources/images/logo.png'
    });

    win.loadURL('http://localhost:3000');

    win.once('ready-to-show', () => {
        win.show();
    });
}

app.on('ready', createWindow);

// TODO save on quit
app.on('before-quit', e => {
    //e.preventDefault();
    //app.quit();
});