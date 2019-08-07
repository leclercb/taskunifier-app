import { Promise } from 'bluebird';

const electron = process.env.REACT_APP_MODE === 'electron' ? window.require('electron') : null;

const fs = electron ? electron.remote.require('fs') : {};
const path = electron ? electron.remote.require('path') : {};

const mkdirpLib = electron ? electron.remote.require('mkdirp') : null;
const rimrafLib = electron ? electron.remote.require('rimraf') : null;

const mkdirpAsync = mkdirpLib ? Promise.promisify(mkdirpLib) : null;
const rimrafAsync = rimrafLib ? Promise.promisify(rimrafLib) : null;

const accessAsync = fs.access ? Promise.promisify(fs.access) : null;
const lstatAsync = fs.lstat ? Promise.promisify(fs.lstat) : null;
const readdirAsync = fs.readdir ? Promise.promisify(fs.readdir) : null;
const readFileAsync = fs.readFile ? Promise.promisify(fs.readFile) : null;
const writeFileAsync = fs.writeFile ? Promise.promisify(fs.writeFile) : null;

export const { sep } = path;

export function exists(path) {
    return accessAsync(path, fs.constants.F_OK);
}

export function join() {
    return path.join(...arguments);
}

export function lstat(path) {
    return lstatAsync(path);
}

export function mkdirp(path) {
    return mkdirpAsync(path);
}

export function readdir(path) {
    return readdirAsync(path);
}

export function readFile(path, encoding) {
    return readFileAsync(path, encoding);
}

export function rimraf(path) {
    return rimrafAsync(path);
}

export function writeFile(file, data) {
    return writeFileAsync(file, data);
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