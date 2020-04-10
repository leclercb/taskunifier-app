export function getAppVersion() {
    const electron = window.require('electron');
    return electron.remote.app.getVersion();
}