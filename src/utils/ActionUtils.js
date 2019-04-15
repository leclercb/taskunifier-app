import uuid from 'uuid';
import { updateProcess } from '../actions/StatusActions';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const rimraf = electron.remote.require("rimraf");

export const { join, sep } = electron.remote.require('path');

export const loadFromFile = (property, file, onData) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            dispatch(updateProcess({
                id: processId,
                status: 'RUNNING',
                title: `Load "${property}" from file`
            }));

            if (!fs.existsSync(file)) {
                dispatch(updateProcess({
                    id: processId,
                    status: 'COMPLETED'
                }));

                onData(null).then(() => resolve()).catch(() => reject());
            } else {
                fs.readFile(file, 'utf-8', (err, data) => {
                    if (err) {
                        dispatch(updateProcess({
                            id: processId,
                            status: 'ERROR',
                            error: err.toString()
                        }));

                        reject();
                    } else {
                        dispatch(updateProcess({
                            id: processId,
                            status: 'COMPLETED'
                        }));

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

            dispatch(updateProcess({
                id: processId,
                status: 'RUNNING',
                title: `Save "${property}" to file`
            }));

            fs.writeFile(file, JSON.stringify(data, null, 4), err => {
                if (err) {
                    dispatch(updateProcess({
                        id: processId,
                        status: 'ERROR',
                        error: err.toString()
                    }));

                    reject();
                } else {
                    dispatch(updateProcess({
                        id: processId,
                        status: 'COMPLETED'
                    }));

                    resolve();
                }
            });
        });
    };
};

export const getPathSeparator = () => {
    return sep;
}

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

export const deleteDirectory = path => {
    if (path && path.startsWith(getUserDataPath())) {
        rimraf.sync(path);
    }
}