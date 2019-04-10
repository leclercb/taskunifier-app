import uuid from 'uuid';
import { updateProcess } from './StatusActions';

const fs = window.require('fs');
const path = window.require('path');

export const loadFromFile = (property, file, onData) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            updateProcess(processId, 'RUNNING', `Load "${property}" from file`)(dispatch, getState);

            fs.readFile(file, 'utf-8', (err, data) => {
                if (err) {
                    updateProcess(processId, 'ERROR', null, err)(dispatch, getState);
                    reject();
                } else {
                    updateProcess(processId, 'COMPLETED')(dispatch, getState);
                    onData(JSON.parse(data)).then(() => resolve());
                }
            });
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
                    updateProcess(processId, 'ERROR', null, err)(dispatch, getState);
                    reject();
                } else {
                    updateProcess(processId, 'COMPLETED')(dispatch, getState);
                    resolve();
                }
            });
        });
    };
};

export const getDirectories = path => {
    const isDirectory = path => fs.lstatSync(path).isDirectory();
    return fs.readdirSync(path).map(name => path.join(path, name)).filter(isDirectory);
}

export const createDirectory = (path, recursive = true) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
            recursive: true
        });
    }
};