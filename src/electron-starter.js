// https://medium.com/@brockhoff/using-electron-with-react-the-basics-e93f9761f86f
const { app, BrowserWindow } = require('electron');

function createWindow() {
    win = new BrowserWindow({ width: 1600, height: 800 });
    win.loadURL('http://localhost:3000/');
}

app.on('ready', createWindow);