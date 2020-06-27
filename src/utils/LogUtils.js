const electron = process.env.REACT_APP_MODE === 'electron' ? window.require('electron') : null;
const electronLog = electron ? electron.remote.require('electron-log') : null;

export function setElectronLoggerLevel(level) {
    if (electronLog) {
        electronLog.transports.file.level = level;
    }
}

export function error(...params) {
    log('error', ...params);
}

export function warn(...params) {
    log('warn', ...params);
}

export function info(...params) {
    log('info', ...params);
}

export function debug(...params) {
    log('debug', ...params);
}

function log(type, ...params) {
    console[type](...params);

    if (electronLog) {
        electronLog[type](...params);
    }
}

export default {
    error,
    warn,
    info,
    debug,
    log: info
};