const electron = window.require('electron');

export function getAppVersion() {
    return electron.ipcRenderer.sendSync('get-version');
}

export function downloadVersion() {
    return electron.ipcRenderer.send('open-file', 'http://taskunifier.sourceforge.net/app.html');
}
