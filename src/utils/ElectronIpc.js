// app-get-path
export function getPath(path) {
    const electron = window.electron;
    return electron.invoke('app-get-path', path);
}

// app-get-path-sync
export function getPathSync(path) {
    const electron = window.electron;
    return electron.sendSync('app-get-path-sync', path);
}

// app-get-version
export function getAppVersion() {
    const electron = window.electron;
    return electron.invoke('app-get-version');
}

// app-set-badge-count
export function setBadgeCount(count) {
    const electron = window.electron;
    return electron.invoke('app-set-badge-count', count);
}

// auto-updater-check-updates
export function checkForUpdates() {
    const electron = window.electron;
    return electron.invoke('auto-updater-check-updates');
}

// auto-updater-download-update
export function downloadUpdate() {
    const electron = window.electron;
    return electron.invoke('auto-updater-download-update');
}

// auto-updater-quit-and-install
export function quitAndInstall() {
    const electron = window.electron;
    return electron.invoke('auto-updater-quit-and-install');
}

// axios
export function axios(config) {
    const electron = window.electron;
    return electron.invoke('axios', config);
}

// axios-create
export function axiosCreate(config, createConfig, httpsAgent) {
    const electron = window.electron;
    return electron.invoke('axios-create', config, createConfig, httpsAgent);
}

// crypto-verify-sync
export function verifyCryptoSync(algorithm, message, object, signature, signatureFormat) {
    const electron = window.electron;
    return electron.sendSync('crypto-verify-sync', algorithm, message, object, signature, signatureFormat);
}

// current-window-close
export function closeCurrentWindow() {
    const electron = window.electron;
    return electron.invoke('current-window-close');
}

// current-window-get-position
export function getCurrentWindowPosition() {
    const electron = window.electron;
    return electron.invoke('current-window-get-position');
}

// current-window-get-size
export function getCurrentWindowSize() {
    const electron = window.electron;
    return electron.invoke('current-window-get-size');
}

// dialog-show-open-dialog
export function showOpenDialog(options) {
    const electron = window.electron;
    return electron.invoke('dialog-show-open-dialog', options);
}

// dialog-show-save-dialog
export function showSaveDialog(options) {
    const electron = window.electron;
    return electron.invoke('dialog-show-save-dialog', options);
}

// fse-access
export function exists(path) {
    const electron = window.electron;
    return electron.invoke('fse-access', path);
}

// fse-copy-file
export function copyFile(src, dest) {
    const electron = window.electron;
    return electron.invoke('fse-copy-file', src, dest);
}

// fse-ensure-dir
export function ensureDir(path) {
    const electron = window.electron;
    return electron.invoke('fse-ensure-dir', path);
}

// fse-lstat
export function lstat(path) {
    const electron = window.electron;
    return electron.invoke('fse-lstat', path);
}

// fse-read-file
export function readFile(path, encoding) {
    const electron = window.electron;
    return electron.invoke('fse-read-file', path, encoding);
}

// fse-readdir
export function readdir(path) {
    const electron = window.electron;
    return electron.invoke('fse-readdir', path);
}

// fse-remove
export function remove(path) {
    const electron = window.electron;
    return electron.invoke('fse-remove', path);
}

// fse-write-file
export function writeFile(file, data) {
    const electron = window.electron;
    return electron.invoke('fse-write-file', file, data);
}

// initiate-quit
export function initiateQuit() {
    const electron = window.electron;
    return electron.invoke('initiate-quit');
}

// log
export function log(type, ...params) {
    const electron = window.electron;
    return electron.invoke('log', type, ...params);
}

// log-get-file
export function getLogFile() {
    const electron = window.electron;
    return electron.invoke('log-get-file');
}

// log-set-level
export function setLogLevel(level) {
    const electron = window.electron;
    return electron.invoke('log-set-level', level);
}

// os-platform
export function getPlatform() {
    const electron = window.electron;
    return electron.invoke('os-platform');
}

// path-dirname
export function dirname(path) {
    const electron = window.electron;
    return electron.invoke('path-dirname', path);
}

// path-join-sync
export function joinSync(...paths) {
    const electron = window.electron;
    return electron.sendSync('path-join-sync', ...paths);
}

// process-get-env
export function getProcessEnv() {
    const electron = window.electron;
    return electron.invoke('process-get-env');
}

// shell-open-external
export function openExternal(url) {
    if (process.env.REACT_APP_MODE === 'electron') {
        const electron = window.electron;
        return electron.invoke('shell-open-external', url);
    } else {
        window.open(url, '_blank').focus();
    }
}

// shell-open-path
export function openPath(path) {
    const electron = window.electron;
    return electron.invoke('shell-open-path', path);
}