import uuid from 'uuid';
import { updateProcess } from 'actions/ProcessActions';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const mkdirp = electron.remote.require('mkdirp');
const rimraf = electron.remote.require('rimraf');

export const { join, sep } = electron.remote.require('path');

export const loadFromFile = (property, file, onData) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: `Load "${property}" from file`
            }));

            if (!fs.existsSync(file)) {
                dispatch(updateProcess({
                    id: processId,
                    state: 'COMPLETED'
                }));

                onData(null).then(() => resolve()).catch(() => reject());
            } else {
                fs.readFile(file, 'utf-8', (err, data) => {
                    if (err) {
                        dispatch(updateProcess({
                            id: processId,
                            state: 'ERROR',
                            error: err.toString()
                        }));

                        reject();
                    } else {
                        dispatch(updateProcess({
                            id: processId,
                            state: 'COMPLETED'
                        }));

                        onData(JSON.parse(data)).then(() => resolve()).catch(() => reject());
                    }
                });
            }
        });
    };
};

export const saveToFile = (property, file, data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: `Save "${property}" to file`
            }));

            fs.writeFile(file, JSON.stringify(data, null, 4), err => {
                if (err) {
                    dispatch(updateProcess({
                        id: processId,
                        state: 'ERROR',
                        error: err.toString()
                    }));

                    reject();
                } else {
                    dispatch(updateProcess({
                        id: processId,
                        state: 'COMPLETED'
                    }));

                    resolve();
                }
            });
        });
    };
};

export const getPathSeparator = () => {
    return sep;
};

export const getUserDataPath = () => {
    return electron.remote.app.getPath('userData');
};

export const getDirectories = path => {
    const isDirectory = path => fs.lstatSync(path).isDirectory();
    return fs.readdirSync(path).map(name => join(path, name)).filter(isDirectory);
};

export const createDirectory = (path) => {
    if (!fs.existsSync(path)) {
        mkdirp(path);
    }
};

export const deleteDirectory = (path, dataFolder) => {
    if (path && (path.startsWith(getUserDataPath()) || path.startsWith(dataFolder))) {
        rimraf.sync(path);
    }
};