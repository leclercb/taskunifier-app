import Constants from 'constants/Constants';

export function getAppVersion() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.sendSync('get-version');
}

export function downloadVersion() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.send('open-file', Constants.downloadUrl);
}
