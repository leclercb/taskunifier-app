// app-get-path
export function getPath(path) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('app-get-path', path);
}

// app-get-path-sync
export function getPathSync(path) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.sendSync('app-get-path-sync', path);
}

// app-get-version
export function getAppVersion() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('app-get-version');
}

// auto-updater-check-updates
export function checkForUpdates() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('auto-updater-check-updates');
}

// auto-updater-download-update
export function downloadUpdate() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('auto-updater-download-update');
}

// auto-updater-quit-and-install
export function quitAndInstall() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('auto-updater-quit-and-install');
}

// axios
export function axios(config) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('axios', config);
}

// axios-create
export function axiosCreate(config, createConfig) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('axios-create', config, createConfig);
}

// axios-https-agent
export function axiosHttpsAgent(config, httpsAgent) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('axios-https-agent', config, httpsAgent);
}

// app-set-badge-count
export function setBadgeCount(count) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('app-set-badge-count', count);
}

// crypto-verify-sync
export function verifyCryptoSync(algorithm, message, object, signature, signatureFormat) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.sendSync('crypto-verify-sync', algorithm, message, object, signature, signatureFormat);
}

// current-window-close
export function closeCurrentWindow() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('current-window-close');
}

// current-window-get-position
export function getCurrentWindowPosition() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('current-window-get-position');
}

// current-window-get-size
export function getCurrentWindowSize() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('current-window-get-size');
}

// dialog-show-open-dialog
export function showOpenDialog(options) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('dialog-show-open-dialog', options);
}

// dialog-show-save-dialog
export function showSaveDialog(options) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('dialog-show-save-dialog', options);
}

// fse-access
export function exists(path) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('fse-access', path);
}

// fse-copy-file
export function copyFile(src, dest) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('fse-copy-file', src, dest);
}

// fse-ensure-dir
export function ensureDir(path) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('fse-ensure-dir', path);
}

// fse-lstat
export function lstat(path) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('fse-lstat', path);
}

// fse-read-file
export function readFile(path, encoding) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('fse-read-file', path, encoding);
}

// fse-readdir
export function readdir(path) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('fse-readdir', path);
}

// fse-remove
export function remove(path) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('fse-remove', path);
}

// fse-write-file
export function writeFile(file, data) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('fse-write-file', file, data);
}

// log
export function log(type, ...params) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('log', type, ...params);
}

// log-get-file
export function getLogFile() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('log-get-file');
}

// log-set-level
export function setLogLevel(level) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('log-set-level', level);
}

// os-platform
export function getPlatform() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('os-platform');
}

// path-dirname
export function dirname(path) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('path-dirname', path);
}

// path-join
export function join() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('path-join', ...arguments);
}

// process-get-env
export function getProcessEnv() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('process-get-env');
}

// shell-open-external
export function openExternal(url) {
    if (process.env.REACT_APP_MODE === 'electron') {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.invoke('shell-open-external', url);
    } else {
        window.open(url, '_blank').focus();
    }
}

// shell-open-path
export function openPath(path) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.invoke('shell-open-path', path);
}