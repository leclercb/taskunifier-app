export function getAppVersion() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.sendSync('get-version');
}