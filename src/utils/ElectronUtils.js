const electron = process.env.REACT_APP_MODE === 'electron' ? window.require('electron') : null;

const fse = electron ? electron.remote.require('fs-extra') : null;
const path = electron ? electron.remote.require('path') : null;

export const sep = path ? path.sep : '/';

export function basename(p) {
    return path.basename(p);
}

export function dirname(p) {
    return path.dirname(p);
}

export function exists(path) {
    return fse.access(path, fse.constants.F_OK);
}

export function join() {
    return path.join(...arguments);
}

export function lstat(path) {
    return fse.lstat(path);
}

export function ensureDir(path) {
    return fse.ensureDir(path);
}

export function readdir(path) {
    return fse.readdir(path);
}

export function readFile(path, encoding) {
    return fse.readFile(path, encoding);
}

export function remove(path) {
    return fse.remove(path);
}

export function writeFile(file, data) {
    return fse.writeFile(file, data);
}

export function getPath(path) {
    return electron.remote.app.getPath(path);
}

export function openExternalLink(url) {
    if (process.env.REACT_APP_MODE === 'electron') {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('open-external', url);
    } else {
        const win = window.open(url, '_blank');
        win.focus();
    }
}