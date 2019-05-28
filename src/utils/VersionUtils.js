import Constants from 'constants/Constants';

const { ipcRenderer } = window.require('electron');

export function getAppVersion() {
    return ipcRenderer.sendSync('get-version');
}

export function downloadVersion() {
    return ipcRenderer.send('open-file', Constants.downloadUrl);
}
