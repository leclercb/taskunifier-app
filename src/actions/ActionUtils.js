import uuid from 'uuid';
import { updateProcess } from './StatusActions';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

export const { join } = electron.remote.require('path');

export const loadFromFile = (property, file, onData) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            updateProcess(processId, 'RUNNING', `Load "${property}" from file`)(dispatch, getState);

            if (!fs.existsSync(file)) {
                updateProcess(processId, 'COMPLETED')(dispatch, getState);
                onData(null).then(() => resolve()).catch(() => reject());
            } else {
                fs.readFile(file, 'utf-8', (err, data) => {
                    if (err) {
                        updateProcess(processId, 'ERROR', null, err.toString())(dispatch, getState);
                        reject();
                    } else {
                        updateProcess(processId, 'COMPLETED')(dispatch, getState);
                        onData(JSON.parse(data)).then(() => resolve()).catch(() => reject());
                    }
                });
            }
        });
    };
};

export const saveToFile = (property, file, data) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            updateProcess(processId, 'RUNNING', `Save "${property}" to file`)(dispatch, getState);

            fs.writeFile(file, JSON.stringify(data, null, 4), err => {
                if (err) {
                    updateProcess(processId, 'ERROR', null, err.toString())(dispatch, getState);
                    reject();
                } else {
                    updateProcess(processId, 'COMPLETED')(dispatch, getState);
                    resolve();
                }
            });
        });
    };
};

export const getUserDataPath = () => {
    return electron.remote.app.getPath('userData');
}

export const getDirectories = path => {
    const isDirectory = path => fs.lstatSync(path).isDirectory();
    return fs.readdirSync(path).map(name => join(path, name)).filter(isDirectory);
}

export const createDirectory = (path, recursive = true) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
            recursive: recursive
        });
    }
};