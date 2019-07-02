import { Promise } from 'bluebird';
import uuid from 'uuid';
import { updateProcess } from 'actions/ThreadActions';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const mkdirp = electron.remote.require('mkdirp');
const rimraf = electron.remote.require('rimraf');

const mkdirpAsync = Promise.promisify(mkdirp);
const rimrafAsync = Promise.promisify(rimraf);

const accessAsync = Promise.promisify(fs.access);
const lstatAsync = Promise.promisify(fs.lstat);
const readdirAsync = Promise.promisify(fs.readdir);
const readFileAsync = Promise.promisify(fs.readFile);
const writeFileAsync = Promise.promisify(fs.writeFile);

export const { join, sep } = electron.remote.require('path');

export function loadFromFile(property, file, onData) {
    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: `Load "${property}" from file`
        }));

        try {
            await accessAsync(file, fs.constants.F_OK);
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            await onData(null);

            return;
        }

        try {
            const data = await readFileAsync(file, 'utf-8');

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            await onData(JSON.parse(data));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function saveToFile(property, file, data) {
    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: `Save "${property}" to file`
        }));

        try {
            await writeFileAsync(file, JSON.stringify(data, null, 4));

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export async function saveBufferToFile(file, buffer) {
    await writeFileAsync(file, buffer);
}

export function getPathSeparator() {
    return sep;
}

export function getUserDataPath() {
    return electron.remote.app.getPath('userData');
}

export async function getDirectories(path) {
    const paths = (await readdirAsync(path)).map(name => join(path, name));
    const lstats = await Promise.all(paths.map(path => lstatAsync(path)));
    return paths.filter((item, i) => lstats[i].isDirectory());
}

export async function createDirectory(path) {
    try {
        await accessAsync(path, fs.constants.F_OK);
    } catch (error) {
        await mkdirpAsync(path);
    }
}

export async function deleteDirectory(path, dataFolder) {
    if (path && (path.startsWith(getUserDataPath()) || path.startsWith(dataFolder))) {
        await rimrafAsync(path);
    }
}